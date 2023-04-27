<template>
<div class="space-y-2 section-wrapper">
  <div class="bg-white rounded section-top shadow-content flex justify-end items-center min-h-[50px]">
    <el-button
      type="primary"
      class="mr-56"
      :disabled="selectPipeSegments.length < 2"
      @click="onMerge"
    >
      合并
    </el-button>
  </div>
  <div class="section-content">
    <div class="flex-grow-0 flex-shrink-0 bg-white rounded section-content-left shadow-content">
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
    <div class="relative flex-grow section-content-right">
      <div class="absolute inset-0 flex flex-col">
        <div class="right-content">
          <mix-table
            v-if="pipeList[0].children.length"
            ref="table"
            :tableColumns="tableColumns"
            :config="tableConfig"
            @onData="onTableGetData"
            @row-click="handleTableRowClick"
            @selection-change="(val)=>handleSelectionChange(val)"
            reqMethods="GET"
            url="/highconsarea/nextOperate"
            :isPagination="false"
            :query="{ taskId:taskId,nodeId: 1,flag: '',pipeCode:pipeCode}"
            :pageParams="{ pageNo:1,pageSize:-1 }"
          >
            <div class="absolute map-layer-switcher-group">
              <LayerSwitcher
                v-model="populationShow"
                title="人居"
                :number="pipeAroundTotal.people"
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
        <div class="flex-grow-0 flex-shrink-0 p-2 mt-2 bg-white rounded shadow-content">
          <div class="flex justify-center">
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
  </div>
  <el-dialog
    v-if="formData"
    title="编辑"
    visible
    width="30%"
    @close="()=>formData = null"
    :close-on-click-modal="false"
  >
    <el-form
      ref="splitForm"
      @validate="validateRest"
      :model="formData"
      label-width="110px"
    >
      <el-form-item
        label="起始里程："
        prop="beginMileage"
        :rules="rules.beginMileage"
      >
        <el-input
          :disabled="formData.beginMileage === 0 || actionType"
          placeholder="请输入"
          v-model="formData.beginMileage"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="actionType"
        label="拆分里程："
        prop="splitMileage"
        :rules="rules.splitMileage"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.splitMileage"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="终止里程："
        prop="endMileage"
        :rules="rules.endMileage"
      >
        <el-input
          placeholder="请输入"
          :disabled="actionType"
          v-model="formData.endMileage"
        ></el-input>
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          type="primary"
          @click="formData = null"
        >取消</el-button>
        <el-button
          type="primary"
          @click="()=>{actionType = !actionType;}"
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
  import * as Refs from '@/mixins/Refs';
  import * as Misc from '@/utils/misc'
  import mapMix from './mapMix';
  import LayerSwitcher from '@/components/LayerSwitcher.vue';
  import createLoading from '@/utils/Loading/loading';
  import qs from 'qs';
  const CURRENT_NODE_STEP = 2;

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    mixins: [Refs.createMap('mixMap', 'ctx'), Refs.createTable('mixTable', 'ctx'), mapMix()],
    data() {

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
          selection: true,
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
          // {
          //   label: "操作",
          //   prop: "operator"
          // },
        ],
        formData: null,
        actionType: false,
        pipeCode: '',
        populationShow: true,
        placeShow: true,
        pipeAroundTotal: {
          people: 300,
          place: 200
        },
        loading: false,
        selectPipeSegments: [],//合并选中的管线列表
      }
    },
    computed: {
      taskId() {
        return this.$route.query.taskId
      },
      taskName() {
        return this.$route.query.taskName
      },
      mapRef() {
        return this.$refs['table'].$refs['basemap'];
      },
      selectedPipe() {
        this.choosePipe = this.$route.query.choosePipe;
        return this.$route.query.choosePipe
      },
      isEveryStep() {
        return this.$route.query.step == "every"
      },
      uniQuery() {
        return this.isEveryStep
          ? qs.parse(this.$route.fullPath.split('?')[1])
          : this.$route.query
      },
      outerMsg() {
        return this.uniQuery.message;
      },
      rules() {
        const getValidator = (errorMsgs, otherJudge) => (rule, value, callback) => {
          if (!value && value !== 0) {
            callback(new Error(errorMsgs[0]));
          }
          if (Number(value) < 0) {
            callback(new Error(errorMsgs[1]));
          }
          otherJudge && otherJudge(value, callback)
          callback()
        }
        return {
          beginMileage: [{
            validator: getValidator(
              ['请输入起始里程', '起始里程必须大于零'],
              (value, callback) => {
                if (value > this.formData.endMileage) {
                  callback(new Error('起始里程必须小于终止里程'))
                }
              }),
            trigger: ['blur']
          }],
          splitMileage: [{
            validator: getValidator(
              ['请输入分割里程', '分割里程必须大于零'],
              (value, callback) => {
                if (value > this.formData.endMileage || value < this.formData.beginMileage) {
                  callback(Error('分割里程必须大于起始里程，小于终止里程'))
                }
              }),
            trigger: ['blur']
          }],
          endMileage: [{
            validator: getValidator(
              ['请输入终止里程', '终止里程必须大于零'],
              (value, callback) => {
                if (value < this.formData.beginMileage) {
                  callback(new Error('终止里程必须大于起始里程'))
                }
              }),
            trigger: ['blur']
          }],
        }
      },
    },
    watch: {
      loading: {
        handler(val) {
          if (!this.loadingMask) {
            this.loadingMask = createLoading.call(this);
          }
          if (val) {
            let text = void 0;
            switch (this.loadingType) {
              case 'handleDiscern': {
                text = '一键识别中...';
                break;
              }
              case 'handleNext': {
                text = '地区等级识别中...';
                break;
              }
              default: {
                text = ''
              }
            }
            this.loadingMask.start({ text, progress: Boolean(text), customClass: 'gislife-loading' })
          } else {
            this.loadingMask.end();
          }
        }
      }
    },
    async created() {
      const loadingFuncs = [
        'getSelectedPipeList',
        'handleDiscern',
        'handleNext',
        'onSubmit',
        'onMerge'
      ];
      loadingFuncs.forEach((key) => {
        this[key] = Misc.bindLoading.call(this, 'loading', this[key], () => {
          this.loadingType = key
        })
      })
      if (this.isEveryStep) {
        await Helper.pipeAddOrUpdate({
          pipeLineVos: this.uniQuery.pipeLineVos,
          taskId: this.taskId,
          taskName: this.taskName,
        })
        await Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP - 1,
          flag: 'next',
        });
      }
      this.getSelectedPipeList();
    },
    methods: {
      getSelectedPipeList() {
        return Helper.queryAllSelected({
          taskId: this.taskId
        })
          .then(async (data) => {
            this.pipeList = [Object.assign(this.pipeList[0], { children: data.data })]
            const choosePipe = data.data
              .find(pipe => pipe.id == this.selectedPipe?.id) || data.data[0];
            this.handlePipeSelect(choosePipe)
            await this.syncMixMapLoaded();
            this.renderPipeLine(data.data)
          })
      },
      /**@description 上一步 */
      onPrev() {
        if (this.isEveryStep) {
          this.$connector.$send(this.uniQuery.message)
        } else {
          this.$router.push({
            path: '/DiscernSteps/choose',
            query: this.$route.query
          })
        }
      },
      /**@description 一键识别 */
      handleDiscern() {
        return Helper.discernOneStep({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP
        })
          .then((res) => {
            this.$router.push({
              path: '/DiscernSteps/discern',
              query: {
                ...this.uniQuery,
                taskId: this.taskId,
                taskName: this.taskName
              }
            })
          })

      },
      /**@description 下一步 */
      handleNext() {
        return Helper.nextStepOpr({
          taskId: this.taskId,
          nodeId: CURRENT_NODE_STEP,
          flag: 'next'
        })
          .then(() => {
            setTimeout(() => {
              this.$router.push({
                path: '/DiscernSteps/level',
                query: {
                  message: this.outerMsg,
                  taskId: this.taskId,
                  taskName: this.taskName,
                  choosePipe: this.choosePipe
                }
              })
            }, 300);
          })
      },
      /**@description 退出 */
      onExit() {
        if (this.isEveryStep) {
          this.$connector.$send(this.uniQuery.message)
        } else {
          this.$router.push('/GhgqDiscern')
        }
      },
      /**@description 单击打开编辑分段接口 */
      onEditSegment(row) {
        this.actionType = false;
        this.formData = {
          beginMileage: row.beginMileage,
          splitMileage: (row.beginMileage + row.endMileage) / 2,
          endMileage: row.endMileage,
        }
        this.__edittingRow = row
      },
      /**@description 编辑分段submit */
      async onSubmit() {
        const { id, code, pipeSegmentCode } = this.__edittingRow;
        try {
          const res = await this.$refs['splitForm'].validate();
          console.log("this.$refs['splitForm'].validate()", res);
          return Helper.pipeSplitSegment({
            code,
            id,
            pipeSegmentCode,
            startMileage: this.formData.beginMileage,
            splitMileage: this.actionType === true ? this.formData.splitMileage : null,
            endMileage: this.formData.endMileage,
            taskId: this.taskId
          })
            .then(() => {
              this.$message.success("拆分成功");
              this.$refs.table.$refs.table.refresh();
            })
            .finally(() => {
              this.__edittingRow = null;
              this.actionType = false;
              this.formData = null;
            })
        } catch (error) {
          console.log('validate error----------------', error);
        }
      },
      /**@description 选择管道 */
      async handlePipeSelect(pipe) {
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
        this.renderFeatures(pipe);
        const populationWkt = pipe.regionDto.populationWkt;
        const specificWkt = pipe.regionDto.specificWkt;
        Object.assign(this.pipeAroundTotal, {
          people: populationWkt.length,
          place: specificWkt.length
        })
      },
      /**@description 管段数据改变，重新渲染分段标识 */
      async onTableGetData(data) {
        await this.syncMixMapLoaded();
        this.renderSegmentLabel(data);
      },

      async handleTableRowClick(row) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(row.wkt)
      },

      togglePopulationVisible(val) {
        this.__populationLayer && this.__populationLayer.toggleVisibility(val)
      },

      togglePlaceVisible(val) {
        this.__placeLayer && this.__placeLayer.toggleVisibility(val)
      },

      handleSelectionChange(val) {
        this.selectPipeSegments = val;
      },

      onMerge() {
        return Helper.mergePipeSegments(this.selectPipeSegments)
          .then(_ => {
            this.$message.success('合并成功');
            this.$refs.table.$refs.table.refresh();
          })
      },
      validateRest(filed, success, message, formRef = this.$refs.splitForm) {
        console.log("validateRest-----------------------", filed, success, message);
        if (success) {
          formRef.fields.forEach(formItem => {
            if (formItem.prop !== filed) {
              formItem.validate(void 0, (errorMsg, filed) => {
                if (!errorMsg) {
                  formItem.clearValidate()
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.mix-table-wrapper .mix-table__action {
    top: -54px;
  }

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

      .section-content-right {
        flex: 1;
        margin: 0;
        display: flex;
        flex-direction: column;

        .right-content {
          flex: 1;
          position: relative;
        }
      }
    }

  }
</style>
