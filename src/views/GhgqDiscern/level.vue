<template>
  <div class="level-wrapper">
    <div class="level-top shadow-content bg-fff"></div>
    <div class="level-content">
      <div class="level-content-left shadow-content bg-fff">
        <el-scrollbar>
          <pipe-selector
            :data="pipeList"
            :defaultOpen="true"
            :optionsKey="{ title: 'name', key: 'id', children: 'children' }"
          ></pipe-selector>
        </el-scrollbar>
      </div>
      <div class="level-content-right">
        <div class="right-content">
          <mix-table
            ref="table"
            :columns="tableColumns"
            :config="tableConfig"
            reqMethods="GET"
            url="/highconsarea/nextOperate"
            :query="{ taskId:taskId,nodeId: 2,flag: ''}"
            :pageParams="{pageNo:1,pageSize:-1}"
          >
            <template #operate="{ row }">
              <el-button
                type="text"
                @click="onEdit(row)"
              >修改等级</el-button>
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
          @click="onSelectLevel(btn.level)"
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
  import * as Helper from './Helper'
  const CURRENT_NODE_STEP = 3;

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
            label: "所属管线",
            prop: ""
          },
          {
            label: "分段编号",
            prop: ""
          },
          {
            label: "地区等级",
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
            label: "人居（户）",
            prop: ""
          },
          {
            label: "特定场所（个）",
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
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      taskName () {
        return this.$route.query.taskName
      },
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
          status: 0
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
            path: '/DiscernSteps/discern',
            query: {
              id: this.taskId,
              taskName: this.taskName
            }
          })
        })
      },
      onEdit (row) {
        this.dialogVisible = true;
        this.__edittingRow = row
      },
      onclose () {
        this.dialogVisible = false;
        this.__edittingRow = null
      },
      onSelectLevel (level) {
        this.selectRowLevel = level
      },
      onDialogAction (aBtn) {
        const { code,id,pipeSegmentCode } = this.__edittingRow;
        switch (aBtn.code) {
          case 'cancel': {
            this.dialogVisible = false;
            this.__edittingRow = null;
          }
          case 'submit': {
            Helper.pipeLevelMutation({
              code,
              id,
              levelName: aBtn.label,
              levelNo: aBtn.level,
              node: CURRENT_NODE_STEP,
              pipeSegmentCode,
              taskId: this.taskId
            }).then(() => {
              this.$message.success('修改成功');
              this.$refs.table.$refs.table.refresh();
              this.dialogVisible = false;
              this.__edittingRow = null;
            })
          }
          default: {
            throw Error(`unCapture action type ${aBtn.code}`)
          }
        }
      }
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

    .level-content-right {
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
