<template>
  <div class="section-wrapper">
    <div class="section-top shadow-content bg-fff"></div>
    <div class="section-content">
      <div class="section-content-left shadow-content bg-fff">
        <el-scrollbar>
          <pipe-selector
            :data="pipeList"
            :defaultOpen="true"
            :optionsKey="{ title: 'name', key: 'id', children: 'children' }"
          ></pipe-selector>
        </el-scrollbar>
      </div>
      <div class="section-content-right">
        <div class="right-content">
          <mix-table
            ref="table"
            :columns="tableColumns"
            :config="tableConfig"
            reqMethods="GET"
            url="/highconsarea/nextOperate"
            :query="{ taskId:taskId,nodeId: 1,flag: ''}"
            :pageParams="{ pageNo:1,pageSize:-1 }"
          >
            <template #operate="{ row }">
              <el-button
                type="text"
                @click="onEditSegment(row)"
              >编辑分段</el-button>
            </template>
          </mix-table>
        </div>
        <div class="right-footer bg-fff shadow-content m-t-10">
          <div>
            <el-button @click="$router.go(-1)">上一步</el-button>
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
          prop="startMileage"
        >
          <el-input
            placeholder="请输入"
            v-model="formData.startMileage"
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
  const CURRENT_NODE_STEP = 2;

  export default {
    components: {
      MixTable,
      PipeSelector
    },
    data () {
      return {
        pipeList: [{
          name: '全部管道',
          id: 1,
          children: []
        }],
        tableConfig: {
          isPagination: false,
        },
        tableColumns: [
          {
            label: "管道名称",
            prop: ""
          },
          {
            label: "分段编号",
            prop: ""
          },
          {
            label: "分段长度（m）",
            prop: ""
          },
          {
            label: "起始里程（m）",
            prop: ""
          },
          {
            label: "终止里程（m）",
            prop: ""
          },
          {
            label: "管径（mm）",
            prop: ""
          },
          {
            label: "压力",
            prop: ""
          },
          {
            label: "传输介质",
            prop: "",
          },
          {
            label: "易燃易爆场所（个）",
            prop: ""
          },
          {
            label: "操作",
            prop: "operate"
          }
        ],
        dialogVisible: false,
        formData: {
          startMileage: 0,
          splitMileage: 0,
          endMileage: 0,
        },
        actionType: false
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
            startMileage: [{ required: true,message: '请输入' }],
            endMileage: [{ required: true,message: '请输入' }],
          },
          this.actionType ? { splitMileage: [{ required: true,message: '请输入' }] } : null
        )
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
          this.pipeList.children = data.data;
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
            path: '/DiscernSteps/section',
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
          startMileage: row.startMileage,
          splitMileage: (row.startMileage + row.endMileage) / 2,
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
          startMileage: this.formData.startMileage,
          splitMileage: this.actionType === true ? this.formData.splitMileage : null,
          endMileage: this.formData.endMileage,
          taskId: this.taskId
        }).then(() => {
          this.$message.success("拆分成功");
          this.$refs.table.$refs.table.refresh();
          this.__edittingRow = null;
          this.formData = {}
        })
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
      }

      .right-footer {
        height: 70px;
        background-color: #fff;
        text-align: center;
        display: flex;
        align-items: center;

        >div {
          margin: 0 auto;
        }
      }
    }
  }

}
</style>
