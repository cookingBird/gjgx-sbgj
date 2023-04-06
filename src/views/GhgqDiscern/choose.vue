<template>
  <div class="choose-wrapper">
    <div class="choose-content">
      <div>
        <div class="choose-title">作业区所有管线列表</div>
        <div class="choose-search m-t-10 m-b-10 ">
          <el-form
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="管线名称：">
              <el-input
                v-model="leftKeyword"
                placeholder="请输入管线名称"
                @clear="getAllPipeList()"
                clearable
              ></el-input>
            </el-form-item>
            <el-button
              class="inline-block ml-1"
              type="primary"
              @click="getAllPipeList()"
            > 查询</el-button>
            <el-button
              class="f-r m-r-10"
              type="success"
              @click="handleSelectAll"
            >全选</el-button>
          </el-form>
        </div>
        <div class="choose-table">
          <div class="choose-table-wrapper">
            <el-table
              height="100%"
              ref="leftTableRef"
              :data="pipeList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                type="index"
                width="55"
                label="序号"
                align="center"
              ></el-table-column>
              <el-table-column
                label="管线"
                prop="pipeName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="类型"
                prop="pipeType"
                align="center"
              ></el-table-column>
              <el-table-column
                label="规格"
                prop="specification"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div>
        <div class="choose-title">已选择管线列表</div>
        <div class="choose-search m-t-10 m-b-10 ">
          <el-form
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="管线名称：">
              <el-input
                v-model="rightKeyword"
                placeholder="请输入管线名称"
                @clear="getSelectedPipeList()"
                clearable
              ></el-input>
            </el-form-item>
            <el-button
              class="inline-block ml-1"
              type="primary"
              @click="getSelectedPipeList()"
            > 查询</el-button>
            <el-button
              class="f-r m-r-10"
              type="primary"
              @click="handleSelectClear"
            >清空</el-button>
          </el-form>
        </div>
        <div class="choose-table">
          <div class="choose-table-wrapper">
            <el-table
              height="100%"
              ref="rightTableRef"
              :data="selectedPipeList"
            >
              <el-table-column
                type="index"
                width="55"
                label="序号"
              ></el-table-column>
              <el-table-column
                label="管线"
                prop="pipeName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="类型"
                prop="pipeType"
                align="center"
              ></el-table-column>
              <el-table-column
                label="规格"
                prop="specification"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="choose-footer m-t-10 shadow-content">
      <div>
        <el-button
          type="primary"
          @click="handleBack"
        >退出</el-button>
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
</template>

<script>
  import * as Helper from './Helper';
  const CURRENT_NODE_STEP = 1;

  export default {
    data () {
      return {
        pipeList: [],
        selectedPipeList: [],
        leftKeyword: '',
        rightKeyword: ''
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      taskName () {
        return this.$route.query.taskName
      }
    },
    mounted () {
      this.bootstrap();
    },
    methods: {
      getAllPipeList () {
        Helper.queryAll({
          keyWords: this.leftKeyword,
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: ''
        }).then((data) => {
          this.pipeList = data.data;
          setTimeout(() => {
            const findKey = 'pipeSegmentCode'
            this.selectedPipeList.forEach(pipe => {
              const findPipe = this.pipeList.find(p => p[findKey] === pipe[findKey]);
              this.$refs['leftTableRef'].toggleRowSelection(findPipe,true)
            })
          },100)
        })
      },
      getSelectedPipeList () {
        Helper.queryAllSelected({
          keyWords: this.rightKeyword,
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: 0,
          taskId: this.taskId
        }).then((data) => {
          this.selectedPipeList = data.data;
        })
      },
      bootstrap () {
        this.getSelectedPipeList();
        this.getAllPipeList();
      },
      handleSelectAll () {
        this.pipeList.forEach(pipe => {
          this.$refs['leftTableRef'].toggleRowSelection(pipe,true)
        })
      },
      handleSelectClear () {
        const findKey = 'pipeSegmentCode'
        this.selectedPipeList.forEach(pipe => {
          const findPipe = this.pipeList.find(p => p[findKey] === pipe[findKey]);
          this.$refs['leftTableRef'].toggleRowSelection(findPipe,false)
        })
        this.selectedPipeList = [];
      },
      handleSelectionChange (rows) {
        function removeRepeat (array,keyFile = id) {
          return array.reduce((pre,curr) => {
            if (pre.findIndex(n => n[keyFile] === curr[keyFile]) > -1) {
              return pre
            } else {
              return pre.concat(curr)
            }
          },[])
        }
        this.selectedPipeList = removeRepeat(this.selectedPipeList.concat(rows),'pipeCode')
      },
      handleBack () {
        this.$router.push('/GhgqDiscern');
      },
      /**@description 下一步 */
      handleNext () {
        Helper.pipeAddOrUpdate({
          pipeLineVos: this.selectedPipeList,
          taskId: this.taskId,
          taskName: this.taskName
        }).then(() => {
          return Helper.nextStepOpr({
            taskId: this.taskId,
            nodeId: CURRENT_NODE_STEP,
            flag: 'next'
          })
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
      /**@description 一键识别 */
      handleDiscern () {
        Helper.pipeAddOrUpdate({
          pipeLineVos: this.selectedPipeList,
          taskId: this.taskId,
          taskName: this.taskName
        }).then(() => {
          return Helper.discernOneStep({
            taskId: this.taskId,
            nodeId: CURRENT_NODE_STEP,
          })
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
    },
  }
</script>

<style lang="scss" scoped>
.choose-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .choose-content {
    flex: 1;
    display: flex;
    justify-content: space-between;

    >div {
      background-color: #fff;
      height: 100%;
      width: calc(50% - 5px);
      display: flex;
      flex-direction: column;

      .choose-title {
        color: #333;
        font-weight: 600;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        text-indent: 16px;
        border-bottom: 1px solid #bbb;
      }

      .choose-table {
        flex: 1;
        position: relative;

        .choose-table-wrapper {
          position: absolute;
          height: 100%;
          width: 100%;

          .el-table {
            margin: 0;
          }
        }
      }
    }
  }

  .choose-footer {
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
</style>
