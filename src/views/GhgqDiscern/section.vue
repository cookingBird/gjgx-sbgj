<template>
<div class="section-wrapper">
  <div class="section-top shadow-content bg-fff"></div>
  <div class="section-content">
    <div class="section-content-left shadow-content bg-fff">
      <el-scrollbar>
        <pipe-selector
          :data="pipeList"
          :defaultOpen="true"
          :defaultSelect="pipeList[0].children[0]?.id"
          :optionsKey="{ title: 'pipeName', key: 'id', children: 'children' }"
          @select="handlePipeSelect"
        ></pipe-selector>
      </el-scrollbar>
    </div>
    <div class="section-content-right">
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
          :query="{ taskId:taskId,nodeId: 1,flag: '',pipeCode:pipeCode}"
          :pageParams="{ pageNo:-1,pageSize:10 }"
        >
          <!-- <template v-slot:operator>
            <el-button>
              分段
            </el-button>
          </template> -->
          <div class="absolute map-layer-switcher-group">
            <LayerSwitcher
              v-model="populationShow"
              title="人居"
              :number="pipeAroundTotal.people"
              @change="onPopulationChange"
            ></LayerSwitcher>
            <LayerSwitcher
              v-model="placeShow"
              :number="pipeAroundTotal.place"
              title="特定场所"
              @change="onPlaceChange"
            ></LayerSwitcher>
          </div>
        </mix-table>
      </div>
      <div class="mt-1 right-footer shadow-content">
        <div>
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
  </div>
  <el-dialog
    v-if="dialogVisible"
    title="编辑"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form
      :model="formData"
      ref="addForm"
      label-width="110px"
      :rules="rules"
    >
      <el-form-item
        label="起始里程："
        prop="beginMileage"
      >
        <el-input
          :disabled="formData.beginMileage === 0"
          placeholder="请输入"
          v-model="formData.beginMileage"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-show="actionType"
        label="拆分里程："
        prop="splitMileage"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.splitMileage"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="终止里程："
        prop="endMileage"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.endMileage"
        ></el-input>
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="actionType = !actionType"
        >
          {{ actionType !== true ? '拆分' : '取消拆分' }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
  import MixTable from '@/components/mixTable';
  import PipeSelector from '@/components/pipeSelector';
  import * as Helper from './Helper';
  import { lineAround } from '@/api/analyse';

  import LayerSwitcher from '@/components/LayerSwitcher.vue'
  const CURRENT_NODE_STEP = 2;

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
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
                label: '编辑分段',
                click: this.onEditSegment
              }
            ],
            width: '100px'
          }
        },
        tableColumns: [
          {
            label: "管道名称",
            prop: "pipeSegmentName"
          },
          {
            label: "分段编号",
            prop: "code"
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
            label: "管径（mm）",
            prop: "diameter"
          },
          {
            label: "压力",
            prop: "pressure"
          },
          {
            label: "传输介质",
            prop: "transmissionMedium",
          },
          {
            label: "易燃易爆场所（个）",
            prop: "flammableExplosivePlace"
          },
          {
            label: "操作",
            prop: "operator"
          },
        ],
        dialogVisible: false,
        formData: {
          beginMileage: 0,
          splitMileage: 0,
          endMileage: 0,
        },
        actionType: false,
        pipeCode: '',
        populationShow: true,
        placeShow: true,
        pipeAroundTotal: {
          people: 300,
          place: 200
        }
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      taskName () {
        return this.$route.query.taskName
      },
      rules () {
        return Object.assign(
          {
            beginMileage: [{ required: true,message: '请输入' }],
            endMileage: [{ required: true,message: '请输入' }],
          },
          this.actionType ? { splitMileage: [{ required: true,message: '请输入' }] } : null
        )
      },
      mapRef () {
        return this.$refs['table'].$refs['basemap'];
      }
    },
    created () {
      this.getSelectedPipeList()
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
          this.handlePipeSelect(data.data[0])
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
        Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP,
          flag: 'next'
        }).then(() => {
          this.$router.push({
            path: '/DiscernSteps/level',
            query: {
              id: this.taskId,
              taskName: this.taskName
            }
          })
        })
      },
      /**@description 单击打开编辑分段接口 */
      onEditSegment (row) {
        this.formData = {
          beginMileage: row.beginMileage,
          splitMileage: (row.beginMileage + row.endMileage) / 2,
          endMileage: row.endMileage,
        }
        this.__edittingRow = row
        this.dialogVisible = true;
      },
      /**@description 编辑分段submit */
      onSubmit () {
        const { id,code,pipeSegmentCode } = this.__edittingRow;
        Helper.pipeSplitSegment({
          code,
          id,
          pipeSegmentCode,
          startMileage: this.formData.beginMileage,
          splitMileage: this.actionType === true ? this.formData.splitMileage : null,
          endMileage: this.formData.endMileage,
          taskId: this.taskId
        }).then(() => {
          this.$message.success("拆分成功");
          this.$refs.table.$refs.table.refresh();
        }).finally(() => {
          this.__edittingRow = null;
          this.actionType = false;
          this.formData = {}
          this.dialogVisible = false;
        })
      },
      onPrev () {
        this.$router.push({
          path: '/DiscernSteps/choose',
          query: this.$route.query
        })
      },
      handlePipeSelect (pipe) {
        const requestDom = require("@/utils/misc").requestDom;
        this.pipeCode = pipe.pipeSegmentCode;
        requestDom(() => this.$refs['table']?.$refs['table'])
          .then((comp) => {
            comp.refresh({ pipeCode: pipe.pipeSegmentCode })
          })
        const pipeAround = require('@/api/analyse').pipeAround;
        pipeAround({ taskId: this.taskId,pipeCode: pipe.pipeSegmentCode })
          .then((res) => {
            this.pipeAroundTotal = {
              people: res.populationWkt.length,
              place: res.specificWkt.length
            }
          })
        // this.onTableGetData([pipe])
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
          populationWkt.length && (this.mapRef.renderMarkerByType(populationWkt,1)
            .then(layer => {
              this.__populationLayer = layer;
            }));
          //特定场所
          specificWkt.length && (this.mapRef.renderMarkerByType(specificWkt,2)
            .then(layer => {
              this.__placeLayer = layer;
            }));
          //易燃易爆场所
          flammableWkt.length && (this.mapRef.renderMarkerByType(flammableWkt,3)
            .then(layer => {
              this.__boomLayer = layer;
            }));

        }
      },
      onPopulationChange (val) {
        this.__populationLayer && this.__populationLayer.toggleVisibility(val)
      },
      onPlaceChange (val) {
        this.__placeLayer && this.__placeLayer.toggleVisibility(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
.section-wrapper {
  width: 100%;
  height: 100%;

  .section-top {
    height: 50px;
    margin-bottom: 10px;
  }

  .section-content {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;

    .section-content-left {
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

    .section-content-right {
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
