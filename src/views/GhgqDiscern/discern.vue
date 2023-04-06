<template>
  <div class="discern-wrapper">
    <div class="discern-top shadow-content bg-fff"></div>
    <div class="discern-content">
      <div class="discern-content-left shadow-content bg-fff">
        <el-scrollbar>
          <pipe-selector
            :data="pipeList"
            :defaultOpen="true"
            :optionsKey="{ title: 'pipeName', key: 'id', children: 'children' }"
          ></pipe-selector>
        </el-scrollbar>
      </div>
      <div class="discern-content-right">
        <div class="right-content">
          <mix-table
            ref="table"
            :tableColumns="tableColumns"
            :config="tableConfig"
            @on-data="onTableGetData"
            @row-click="handleTableRowClick"
            reqMethods="GET"
            url="/highconsarea/nextOperate"
            :isPagination="false"
            :query="{ taskId:taskId,nodeId: 3,flag: '',pipeCode:pipeCode}"
            :pageParams="{pageNo:1,pageSize:-1}"
          >
            <div class="absolute map-layer-switcher-group">
              <LayerSwitcher
                v-model="populationShow"
                @change="onPopulationChange"
              ></LayerSwitcher>
              <LayerSwitcher
                v-model="placeShow"
                title="特定场所"
                @change="onPlaceChange"
              ></LayerSwitcher>
            </div>
          </mix-table>
        </div>
        <div class="mt-2 right-footer shadow-content">
          <div>
            <el-button
              type="primary"
              @click="onPrev"
            >上一步</el-button>
            <el-button
              type="primary"
              @click="handleNext"
            >完成</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      @close="onclose"
      v-if="dialogVisible"
      title="修改地区等级"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="flex justify-around">
        <el-button
          v-for="btn in levelGroup"
          :key="btn.level"
          :class="{'level-active':selectRowLevel === btn.level}"
          class="text-gray-900 border-[#f4f4f5] bg-[#f4f4f5] rounded-full hover:border-[#71b5ff] hover:bg-[#ecf5ff] hover:text-[#71b5ff]"
          @click="onSelectLevel(btn)"
        >
          {{ btn.label }}
        </el-button>
      </div>
      <div class="flex justify-center mt-2">
        <el-button
          v-for="aBtn in dialogAction"
          :key="aBtn.code"
          @click="onDialogAction(aBtn)"
        >
          {{ aBtn.label }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import MixTable from '@/components/mixTable';
  import PipeSelector from '@/components/pipeSelector';
  import * as Helper from './Helper';
  import { lineAround } from '@/api/analyse';
  import LayerSwitcher from '@/components/LayerSwitcher.vue'
  const CURRENT_NODE_STEP = 4;

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    data () {
      return {
        pipeList: [{
          pipeName: '全部管道',
          id: 1,
          children: []
        }],
        tableConfig: {
          isPagination: false,
          buttons: {
            fixed: 'right',
            list: [
              {
                size: 'normal',
                label: '修改等级',
                click: this.onEdit
              }
            ],
            width: '100px'
          }
        },
        tableColumns: [
          {
            label: "所属管线",
            prop: "pipeSegmentName"
          },
          {
            label: "高后果区编号",
            prop: "hcaNo"
          },
          {
            label: "是否高后果区",
            prop: "isHigh",
            format (val) {
              if (val === null) {
                return '-'
              } else if (val == 0) {
                return '否'
              } else if (val == 1) {
                return '是'
              }
            }
          },
          {
            label: "高后果区等级",
            prop: "hcaLevel",
            format: function (val) {
              if (val == 0) {
                return '-'
              } else if (val == 1) {
                return '一级'
              } else if (val == 2) {
                return '二级'
              } else if (val == 3) {
                return '三级'
              } else if (val == 4) {
                return '四级'
              } else {
                return val
              }
            }
          },
          {
            label: "长度（m）",
            prop: "segmentLength"
          },
          {
            label: "终止里程（m）",
            prop: "endMileage"
          },
          {
            label: "地区等级",
            prop: "regionLevel",
            format: function (val) {
              if (val == 0) {
                return '-'
              } else if (val == 1) {
                return '一级'
              } else if (val == 2) {
                return '二级'
              } else if (val == 3) {
                return '三级'
              } else if (val == 4) {
                return '四级'
              } else {
                return val
              }
            }
          },
          {
            label: "人居（户）",
            prop: "population",
          },
          {
            label: "特定场所（个）",
            prop: "specificProduction"
          },
          {
            label: "易燃易爆场所（个）",
            prop: "flammableExplosivePlace"
          },
          {
            label: "影响半径",
            prop: "impactRadius"
          },
          {
            label: "暴露半径",
            prop: "exposureRadius"
          },
          {
            label: "识别时间",
            prop: "recognitionTime"
          }
        ],
        dialogVisible: false,
        levelGroup: [
          { label: '一级',level: 1 },
          { label: '二级',level: 2 },
          { label: '三级',level: 3 },
          { label: '四级',level: 4 },
        ],
        dialogAction: [
          { label: '取消',code: 'cancel' },
          { label: '确定',code: 'submit' },
        ],
        selectRowLevel: 1,
        pipeCode: '',
        populationShow: true,
        placeShow: true
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      taskName () {
        return this.$route.query.taskName
      },
      mapRef () {
        return this.$refs['table'].$refs['basemap'];
      }
    },
    created () {
      this.getSelectedPipeList();
    },
    methods: {
      getSelectedPipeList () {
        Helper.queryAllSelected({
          keyWords: '',
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: 0,
          taskId: this.taskId
        }).then((data) => {
          this.pipeList[0].children = data.data;
        })
      },

      /**@description 下一步 */
      handleNext () {
        Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP,
          flag: 'next'
        }).then(() => {
          this.$router.push({
            path: '/GhgqDiscern',
          })
        })
      },
      /**@description 编辑等级，打开弹窗 */
      onEdit (row) {
        this.dialogVisible = true;
        this.__edittingRow = row
      },
      /**@description 关闭弹窗 */
      onclose () {
        this.dialogVisible = false;
        this.__edittingRow = null
      },
      /**@description 选择等级 */
      onSelectLevel (level) {
        this.selectRowLevel = level
      },
      /**@description 关闭弹窗，提交表单 */
      onDialogAction (aBtn) {
        const { code,id,pipeSegmentCode } = this.__edittingRow;
        switch (aBtn.code) {
          case 'cancel': {
            this.dialogVisible = false;
            this.__edittingRow = null;
            break;
          }
          case 'submit': {
            Helper.pipeLevelMutation({
              code,
              id,
              levelName: this.selectRowLevel.label,
              levelNo: this.selectRowLevel.level,
              node: CURRENT_NODE_STEP,
              pipeSegmentCode,
              taskId: this.taskId
            }).then(() => {
              this.$message.success('修改成功');
              this.$refs.table.$refs.table.refresh();
              this.dialogVisible = false;
              this.__edittingRow = null;
            })
            break;
          }
          default: {
            throw Error(`unCapture action type ${aBtn.code}`)
          }
        }
      },
      onPrev () {
        this.$router.push({
          path: '/DiscernSteps/level',
          query: this.$route.query
        })
      },
      onTableGetData (data) {
        this.mapRef.pipeRadiusRemove();
        this.mapRef.pipeRender(data);
      },
      async handleTableRowClick (row) {
        const { code,data } = await lineAround({ id: row.id });
        if (code === 200) {

          const { regionWkt,flammableWkt,specificWkt,populationWkt } = data;
          //影响半径
          regionWkt && this.mapRef.pipeRadiusRender(regionWkt);
          //人居
          populationWkt.length && (this.__populationLayer = this.mapRef.renderMarkerByType(populationWkt,1));
          //特定场所
          specificWkt.length && (this.__placeLayer = this.mapRef.renderMarkerByType(specificWkt,2));
          //易燃易爆场所
          flammableWkt.length && (this.__boomLayer = this.mapRef.renderMarkerByType(flammableWkt,3));

        }
      },
      onPopulationChange (val) {
        this.__populationLayer && this.__populationLayer(val)
      },
      onPlaceChange (val) {
        this.__placeLayer && this.__placeLayer(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
.discern-wrapper {
  width: 100%;
  height: 100%;

  .discern-top {
    height: 50px;
    margin-bottom: 10px;
  }

  .discern-content {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;

    .discern-content-left {
      width: 340px;
      height: 100%;
      margin-right: 10px;
      padding: 8px;

      ::v-deep .el-scrollbar {
        height: 100%;
        background-color: #EEF2F6;

        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }

    .discern-content-right {
      flex: 1;
      margin: 0;
      display: flex;
      flex-direction: column;

      .right-content {
        flex: 1;
        position: relative
      }

      .right-footer {
        background-color: #fff;
        display: flex;
        justify-content: center;
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
  }

}
</style>
