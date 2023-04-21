<template>
<div class="discern-wrapper">
  <div class="discern-top shadow-content bg-fff"></div>
  <div class="discern-content">
    <div class="flex-grow-0 flex-shrink-0 bg-white rounded discern-content-left shadow-content">
      <el-scrollbar>
        <pipe-selector
          :data="pipeList"
          :defaultOpen="true"
          :defaultSelect="selectedPipe?.id || pipeList[0].children[0]?.id"
          :optionsKey="{ title: 'pipeName', key: 'id', children: 'children' }"
          @select="handlePipeSelect"
        ></pipe-selector>
      </el-scrollbar>
    </div>
    <div
      ref="loadingMask"
      class="relative flex-grow discern-content-right"
    >
      <div class="absolute inset-0 flex flex-col">
        <div class="flex-grow right-content">
          <mix-table
            ref="table"
            class="!w-auto"
            :tableColumns="tableColumns"
            :config="tableConfig"
            @onData="onTableGetData"
            @row-click="handleTableRowClick"
            reqMethods="GET"
            url="/highconsarea/nextOperate"
            :isPagination="false"
            :query="{ taskId:taskId,nodeId: 3,flag: '',pipeCode:pipeCode}"
            :pageParams="{pageNo:1,pageSize:-1}"
          >
            <!-- <template v-slot:action>
            <el-button
              type="text"
              @click="onEdit(slotProps)"
            >修改等级</el-button>
          </template> -->
            <div class="absolute map-layer-switcher-group">
              <LayerSwitcher
                v-model="populationShow"
                :number="pipeAroundTotal.people"
                title="人居"
                @change="togglePopulationVisible"
              ></LayerSwitcher>
              <LayerSwitcher
                v-model="placeShow"
                :number="pipeAroundTotal.place"
                title="特定场所"
                @change="togglePlaceVisible"
              ></LayerSwitcher>
            </div>
          </mix-table>
        </div>
        <div class="flex-grow-0 flex-shrink-0 mt-2 rounded right-footer shadow-content">
          <div>
            <el-button
              type="primary"
              @click="onExit"
            >退出</el-button>
            <el-button
              type="primary"
              @click="onPrev"
            >上一步</el-button>
            <el-button
              type="primary"
              @click="handleFinish"
            >完成</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-if="edittingRow"
    @close="onclose"
    title="修改地区等级"
    :visible="true"
    width="30%"
  >
    <div class="flex justify-around">
      <el-button
        v-for="btn in levelGroup"
        :key="btn.level"
        :class="{'selected':edittingRow.hcaLevel == btn.level}"
        class="el-button-level"
        @click="onSelectLevel(btn)"
      >
        {{ btn.label }}
      </el-button>
    </div>
    <div class="flex justify-center mt-7">
      <el-button
        type="primary"
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
  import * as Refs from '@/mixins/Refs';
  import LayerSwitcher from '@/components/LayerSwitcher.vue';
  import mapMix from './mapMix';
  import qs from 'qs';
  import * as Misc from '@/utils/misc';
  import createLoading from '@/utils/Loading/loading';
  const CURRENT_NODE_STEP = 4;

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    mixins: [Refs.createMap('mixMap','ctx'),Refs.createTable('mixTable','ctx'),mapMix()],
    data () {
      return {
        pipeList: [
          {
            pipeName: '全部管道',
            id: 1,
            children: []
          }
        ],
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
            prop: "pipeSegmentName",
            width: 150
          },
          {
            label: "高后果区编号",
            prop: "hcaNo",
            width: 150
          },
          {
            label: "是否高后果区",
            prop: "isHigh",
            width: 150,
            format (val) {
              if (val === null) {
                return '否'
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
            width: 120,
            format: function (val) {
              if (val == 0) {
                return '非高后果区'
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
            prop: "segmentLength",
            width: 120,
          },
          {
            label: "终止里程（m）",
            prop: "endMileage",
            width: 120,
          },
          {
            label: "地区等级",
            prop: "regionLevel",
            width: 120,
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
            width: 120,
          },
          {
            label: "特定场所（个）",
            prop: "specificProduction",
            width: 120,
          },
          {
            label: "易燃易爆场所（个）",
            prop: "flammableExplosivePlace",
            width: 120,
          },
          {
            label: "影响半径",
            prop: "impactRadius",
            width: 120,
          },
          {
            label: "暴露半径",
            prop: "exposureRadius",
            width: 120,
          },
          {
            label: "识别时间",
            prop: "recognitionTime",
            width: 120,
            format (val) {
              return val ? val.split(' ')[0] : '-'
            }
          },
          // {
          //   label: "操作",
          //   prop: "action"
          // },
        ],
        dialogVisible: false,
        levelGroup: [
          { label: '非高后果区',level: 0 },
          { label: '一级',level: 1 },
          { label: '二级',level: 2 },
          { label: '三级',level: 3 },
        ],
        dialogAction: [
          { label: '取消',code: 'cancel' },
          { label: '确定',code: 'submit' },
        ],
        selectRowLevel: 1,
        pipeCode: '',
        populationShow: true,
        placeShow: true,
        edittingRow: null,
        pipeAroundTotal: {
          people: 300,
          place: 200
        },
        loading: true
      }
    },
    computed: {
      taskId () {
        return this.$route.query.taskId
      },
      taskName () {
        return this.$route.query.taskName
      },
      mapRef () {
        return this.$refs['table'].$refs['basemap'];
      },
      selectedPipe () {
        this.choosePipe = this.$route.query.choosePipe;
        return this.$route.query.choosePipe
      },
      isOneStep () {
        return this.$route.query.step === 'one'
      },
      uniQuery () {
        return this.isOneStep
          ? qs.parse(this.$route.fullPath.split('?')[1])
          : this.$route.query
      },
      isFromOuter () {
        return Boolean(this.uniQuery.message)
      },
    },
    watch: {
      loading: {
        immediate: true,
        handler (val) {
          if (!this.loadingMask) {
            this.loadingMask = createLoading.call(this,document.body);
          }
          if (val) {
            this.loadingMask.start()
          } else {
            this.loadingMask.end();
          }
        }
      }
    },
    async created () {
      console.log('discern created-----------------',this.$route);
      const loadingFuncs = ['getSelectedPipeList','handleFinish','onDialogAction'];
      loadingFuncs.forEach((key) => {
        this[key] = Misc.bindLoading.bind(this)('loading',this[key])
      })
      if (this.isOneStep) {
        await Helper.pipeAddOrUpdate({
          pipeLineVos: this.uniQuery.pipeLineVos,
          taskId: this.taskId,
          taskName: this.taskName,
        })
        await Helper.discernOneStep({
          taskId: this.taskId,
          nodeId: 1,
        });
      }
      this.getSelectedPipeList();
    },
    methods: {
      getSelectedPipeList () {
        return Helper.queryAllSelected({
          keyWords: '',
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: 0,
          taskId: this.taskId
        }).then(async (data) => {
          this.pipeList = [Object.assign(this.pipeList[0],{ children: data.data })]
          const choosePipe = data.data
            .find(pipe => pipe.id === this.choosePipe?.id) || data.data[0];
          this.handlePipeSelect(choosePipe);
          await this.syncMixMapLoaded();
          this.renderPipeLine(data.data)
        })
      },
      /**@description 选择管道 */
      async handlePipeSelect (pipe) {
        this.choosePipe = pipe
        this.pipeCode = pipe.pipeSegmentCode
        const mixTableRef = await this.syncMixTableMounted()
        mixTableRef.refresh({ pipeCode: pipe.pipeSegmentCode })
        const mixMapRef = await this.syncMixMapLoaded()
        if (pipe.wkt) {
          mixMapRef.locationByLineString(pipe.wkt)
        } else {
          this.$message.error('管线wkt为null')
        }
        this.renderRadius(pipe)
        this.renderFeatures(pipe)
        const populationWkt = pipe.regionDto.populationWkt;
        const specificWkt = pipe.regionDto.specificWkt;
        Object.assign(this.pipeAroundTotal,{
          people: populationWkt.length,
          place: specificWkt.length
        })
      },
      /**@description 完成 */
      handleFinish () {
        return Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP,
          flag: 'next'
        })
          .then(() => {
            if (this.isFromOuter) {
              this.$connector.$send(this.uniQuery.message)
            } else {
              this.$router.push({
                path: '/GhgqDiscern',
              })
            }
          })
      },
      /**@description 上一步 */
      onPrev () {
        const back = () => {
          this.$router.push({
            path: '/DiscernSteps/level',
            query: {
              ...this.$route.query,
              choosePipe: Misc.pickFileds(
                this.choosePipe,
                'id',
                'pipeCode',
                'pipeSegmentCode',
                'pipeName'
              )
            }
          })
        }
        if (this.isOneStep) {
          this.$connector.$send(this.uniQuery.message)
        } else {
          back()
        }
      },
      /**@description 退出 */
      onExit () {
        if (this.isFromOuter) {
          this.$connector.$send(this.uniQuery.message)
        } else {
          this.$router.push('/GhgqDiscern')
        }
      },
      /**@description 编辑等级，打开弹窗 */
      onEdit (row) {
        this.edittingRow = row;
      },
      /**@description 关闭弹窗 */
      onclose () {
        this.edittingRow = null
      },
      /**@description 选择等级 */
      onSelectLevel (btn) {
        Object.assign(this.edittingRow,btn)
      },
      /**@description 关闭弹窗，提交表单 */
      onDialogAction (aBtn) {
        switch (aBtn.code) {
          case 'cancel': {
            this.edittingRow = null;
            return Promise.resolve();
          }
          case 'submit': {
            const { level,label,code,id,pipeSegmentCode } = this.edittingRow
            return Helper.pipeLevelMutation({
              code,
              id,
              levelName: label,
              levelNo: level,
              node: CURRENT_NODE_STEP,
              pipeSegmentCode,
              taskId: this.taskId
            }).then(() => {
              this.$message.success('修改成功');
              this.$refs.table.$refs.table.refresh();
              this.edittingRow = null;
            })
          }
          default: {
            throw Error(`unCapture action type ${aBtn.code}`)
          }
        }
      },

      async onTableGetData (data) {
        const mapRef = await this.syncMixMapLoaded();
        this.renderSegmentLabel(data,mapRef);
        this.renderLevel(data,'hcaLevel',mapRef);
      },
      async handleTableRowClick (row) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(row.wkt)
      },
      togglePopulationVisible (val) {
        this.__populationLayer && this.__populationLayer.toggleVisibility(val)
      },
      togglePlaceVisible (val) {
        this.__placeLayer && this.__placeLayer.toggleVisibility(val)
      },

    },
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
        width: 300px;
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
          position: relative,
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
