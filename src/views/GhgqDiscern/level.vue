<template>
<div class="level-wrapper">
  <div class="bg-white rounded level-top shadow-content"></div>
  <div class="level-content">
    <div class="flex-grow-0 flex-shrink-0 bg-white rounded level-content-left shadow-content">
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
      class="flex-grow level-content-right"
      v-loading="loading"
    >
      <div class="right-content">
        <mix-table
          ref="table"
          :tableColumns="tableColumns"
          :config="tableConfig"
          @onData="onTableGetData"
          @row-click="handleTableRowClick"
          reqMethods="GET"
          url="/highconsarea/nextOperate"
          :isPagination="false"
          :query="{ taskId:taskId,nodeId: 2,flag: '',pipeCode: pipeCode}"
          :pageParams="{pageNo:1,pageSize:-1}"
        >
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
      <div class="mt-2 rounded right-footer shadow-content">
        <el-button
          type="primary"
          @click="onPrev"
        >上一步</el-button>
        <el-button
          type="primary"
          @click="handleDiscern"
        >一键识别</el-button>
        <el-button
          type="primary"
          @click="handleNext"
        >下一步</el-button>

      </div>
    </div>
  </div>
  <el-dialog
    @close="onclose"
    v-if="dialogVisible"
    title="修改地区等级"
    :visible.sync="dialogVisible"
    width="25%"
  >
    <div class="flex justify-around">
      <el-button
        v-for="btn in levelGroup"
        :key="btn.level"
        :class="{'selected':(selectRowLevel == btn.level || selectRowLevel == btn.label)}"
        class="el-button-level"
        @click="onSelectLevel(btn)"
      >
        {{ btn.label }}
      </el-button>
    </div>
    <div class="flex justify-center mt-7">
      <el-button
        v-for="aBtn in dialogAction"
        type="primary"
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
  import * as Helper from './Helper'
  import LayerSwitcher from '@/components/LayerSwitcher.vue';
  import * as Misc from '@/utils/misc';
  import mapMix from './mapMix';
  import mapLifecycleRef from '@/mixins/mapLifecycleRef';
  import tableRef from '@/mixins/tableRef';
  const CURRENT_NODE_STEP = 3;

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    mixins: [mapLifecycleRef(),tableRef(),mapMix()],
    data () {
      return {
        pipeList: [{
          pipeName: '全部管道',
          id: 1,
          pipeCode: 1,
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
            label: "分段编号",
            prop: "code"
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
            label: "分段长度（m）",
            prop: "segmentLength"
          },
          {
            label: "起始里程（m）",
            prop: "beginMileage"
          },
          {
            label: "终止里程（m）",
            prop: "endMileage"
          },
          {
            label: "人居（户）",
            prop: "population"
          },
          {
            label: "特定场所（个）",
            prop: "specificProduction",
          },
          {
            label: "易燃易爆场所（个）",
            prop: "flammableExplosivePlace"
          },
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
        placeShow: true,
        pipeAroundTotal: {
          people: 300,
          place: 200
        },
        loading: true,
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
      },
      selectedPipe () {
        this.choosePipe = this.$route.query.choosePipe;
        return this.$route.query.choosePipe
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
          this.pipeList = [Object.assign(this.pipeList[0],{ children: data.data })]
          const choosePipe = data.data
            .find(pipe => pipe.id == this.selectedPipe?.id) || data.data[0]
          this.handlePipeSelect(choosePipe);
          this.renderPipeLine(data.data);
          this.loading = false;
        })
      },
      /**@description 一键识别 */
      handleDiscern () {
        Helper.discernOneStep({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP
        }).then((res) => {
          this.$router.push({
            path: '/DiscernSteps/discern',
            query: {
              id: this.taskId,
              taskName: this.taskName
            }
          })
        })
      },
      /**@description 下一步 */
      handleNext () {
        this.loading = true;
        Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP,
          flag: 'next'
        }).then(() => {
          this.$router.push({
            path: '/DiscernSteps/discern',
            query: {
              id: this.taskId,
              taskName: this.taskName,
              choosePipe: Misc.pickFileds(
                this.choosePipe,
                'id',
                'pipeCode',
                'pipeSegmentCode',
                'pipeName'
              )
            }
          })
        }).finally(_ => {
          this.loading = false;
        })
      },
      onEdit (row) {
        this.dialogVisible = true;
        this.__edittingRow = row;
        this.selectRowLevel = row.regionLevel;
      },
      onclose () {
        this.dialogVisible = false;
        this.__edittingRow = null
      },
      onSelectLevel (btn) {
        this.__selectBtn = btn;
        this.selectRowLevel = btn.level
      },
      onDialogAction (aBtn) {
        const { code,id,pipeSegmentCode } = this.__edittingRow;
        switch (aBtn.code) {
          case 'cancel': {
            this.dialogVisible = false;
            this.__edittingRow = null;
            break;
          }
          case 'submit': {
            const { label,level } = this.__selectBtn;
            Helper.pipeLevelMutation({
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
      /**@description 上一步 */
      onPrev () {
        console.log('onPrev--------',this.choosePipe)
        this.$router.push({
          path: '/DiscernSteps/section',
          query: {
            ...this.$route.query,
            choosePipe: this.choosePipe
          }
        })
      },
      /**@description 选择管道 */
      async handlePipeSelect (pipe) {
        this.choosePipe = pipe
        this.pipeCode = pipe.pipeSegmentCode
        const mixTableRef = await this.syncMixTableMounted()
        mixTableRef.refresh({ pipeCode: pipe.pipeSegmentCode })
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(pipe.wkt)
        this.renderRadius(pipe)
        this.renderFeatures(pipe)
        const populationWkt = pipe.regionDto.populationWkt;
        const specificWkt = pipe.regionDto.specificWkt;
        Object.assign(this.pipeAroundTotal,{
          people: populationWkt.length,
          place: specificWkt.length
        })
      },

      onTableGetData (data) {
        console.log('onTableGetData--------',data)
        this.renderSegmentLabel(data);
        this.renderLevel(data);
      },

      async handleTableRowClick (row) {
        const mixMapRef = await this.syncMixMapLoaded()
        console.log('row click---------------------',row);
        mixMapRef.locationByLineString(row.wkt)
      },

      togglePopulationVisible (val) {
        this.__populationLayer && this.__populationLayer.toggleVisibility(val)
      },
      togglePlaceVisible (val) {
        this.__placeLayer && this.__placeLayer.toggleVisibility(val)
      },
    }
  }
</script>

<style lang="scss" scoped>
.level-wrapper {
  width: 100%;
  height: 100%;

  .level-top {
    height: 50px;
    margin-bottom: 10px;
  }

  .level-content {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;

    .level-content-left {
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

    .level-content-right {
      flex: 1;
      margin: 0;
      display: flex;
      flex-direction: column;

      .right-content {
        flex: 1;
        position: relative;
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
