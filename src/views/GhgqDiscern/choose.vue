<template>
<div
  class="choose-wrapper"
  v-loading="loading"
>
  <div class="space-x-2 choose-content">
    <div class="flex-grow-0 flex-shrink-0 w-1/3 rounded">
      <div class="choose-title">作业区所有管线列表</div>
      <div class="my-2 choose-search">
        <el-form
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="管线名称：">
            <el-input
              v-model="leftKeyword"
              placeholder="请输入管线名称"
              @clear="queryPipeList"
              clearable
            ></el-input>
          </el-form-item>
          <el-button
            class="inline-block ml-1"
            type="primary"
            @click="queryPipeList"
          >
            查询</el-button>
          <el-button
            class="float-right mr-2"
            type="success"
            @click="handleSelectAll"
          >全选</el-button>
        </el-form>
      </div>
      <div class="flex flex-col flex-grow choose-table">
        <div class="flex-grow px-1">
          <el-table
            ref="leftTableRef"
            height="100%"
            border
            :data="pipeList"
            @selection-change="(val)=>handleSelectionChange(val,'left')"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              type="index"
              width="55"
              :index="calcIndex"
              label="序号"
              align="center"
            ></el-table-column>
            <el-table-column
              label="管线"
              prop="pipeName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="传输介质"
              prop="transferMaterial"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
        <div class="flex justify-center flex-grow-0 flex-shrink-0 p-3">
          <el-pagination
            layout="total,sizes, prev, pager, next, jumper"
            :total="leftPageCfg.total"
            :current-page.sync="leftPageCfg.pageNo"
            :page-size.sync="leftPageCfg.pageSize"
            @size-change="queryPipeList"
            @current-change="queryPipeList"
            @prev-click="queryPipeList"
            @next-click="queryPipeList"
            background
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="flex-grow rounded">
      <div class="choose-title">已选择管线列表</div>
      <div class="my-2 choose-search">
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
          >
            查询
          </el-button>
          <el-button
            class="float-right mr-2 border-0 bg-[#3097cf] hover:bg-[##39aeed]"
            type="primary"
            @click="handleSelectClear"
          >
            取消选择
          </el-button>
        </el-form>
      </div>
      <div class="choose-table">
        <div class="absolute inset-0 px-1 pb-1">
          <el-table
            height="100%"
            ref="rightTableRef"
            :data="selectedListFiltered"
            border
            @selection-change="(val)=>handleSelectionChange(val,'right')"
          >
            <template v-for="(item, index) in rightCols">
              <el-table-column
                v-if="item.formatter"
                :key="index"
                v-bind="item"
              >
                <template v-slot:default="{row}">
                  {{ item.formatter(row[item.prop]) }}
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.slotIs === 'input'"
                :key="index"
                v-bind="item"
              >
                <template v-slot:default="scope">
                  <el-input
                    v-model="scope.row[item.prop]"
                    v-bind="item.slotProps&&item.slotProps(scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.slotIs === 'button' || item.slotIs === 'btn'"
                :key="index"
                v-bind="item"
              >
                <template v-slot:default="scope">
                  <el-button
                    v-bind="slotProps&&slotProps(scope)"
                    v-on="mapListeners(item.listeners,(val)=>val(scope))"
                  >
                    {{item.slotProps&&item.slotProps(scope).label}}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="index"
                v-bind="item"
              />
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center rounded m-t-10 choose-footer shadow-content">
    <div class="p-2">
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
  import * as Misc from '@/utils/misc'
  const CURRENT_NODE_STEP = 1;

  export default {
    data () {
      return {
        pipeList: [],
        selectedPipeList: [],
        leftKeyword: '',
        rightKeyword: '',
        leftMaxHeight: 300,
        leftPageCfg: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
        },
        rightCols: [
          { width: 55,type: 'selection',align: 'center' },
          { width: 55,type: 'index',align: 'center',index: this.calcIndex,label: '序号' },
          { width: 150,align: 'center',prop: 'pipeName',label: '管线' },
          { width: 120,align: 'center',prop: 'transferMaterial',label: '传输介质' },
          {
            width: 120,align: 'center',prop: 'hydrogenSulfideConcentration',label: '硫化氢浓度',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
          {
            width: 120,align: 'center',prop: 'hydrogenSulfideMolPercent',label: '硫化氢百分比',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
          {
            width: 136,align: 'center',prop: 'mediumMolecularMass',label: '介质相对分子质量',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
          {
            width: 120,align: 'center',prop: 'operatingPressure',label: '介质运行压力',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
          {
            width: 120,align: 'center',prop: 'mediumMolecularMass',label: '介质运行温度',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
          {
            width: 120,align: 'center',prop: 'leakEstimate',label: '泄露管段管容',
            slotIs: 'input',
            slotProps ({ row }) {
              return {
                // class: 'el-input:border-0 el-input:hover:bg-transparent'
                class: 'el-input:border-0 el-input:bg-transparent',
                disabled: row.sulfurContain === 0
              }
            }
          },
        ],
        loading: true
      };
    },
    computed: {
      taskId () {
        return this.$route.query.id;
      },
      taskName () {
        return this.$route.query.taskName;
      },
      selectedListFiltered () {
        return this.selectedPipeList
          .filter((node) => node.pipeName.includes(this.rightKeyword));
      },
    },
    mounted () {
      this.bootstrap();
    },
    methods: {
      queryPipeList () {
        const { pageNo,pageSize } = this.leftPageCfg;
        return Helper.queryAll({
          keyWords: this.leftKeyword,
          pageNo: pageNo,
          pageSize: pageSize,
          startTime: '',
          endTime: '',
          status: '',
        }).then((data) => {
          this.leftPageCfg = {
            ...this.leftPageCfg,
            total: data.totalCount,
          };
          this.pipeList = data.data;
          // this.pipeList = new Array(50).fill({
          //   id: Math.random(),
          //   pipeName: "平籍线A",
          //   pipeCode: null,
          //   pipeSegmentCode: "GE0401050300000282",
          //   pipeType: "净化气",
          // }).map((item,index) => ({ ...item,id: index }))
          this.syncItemStatus();
        });
      },
      getSelectedPipeList () {
        return Helper.queryAllSelected({
          keyWords: this.rightKeyword,
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: 0,
          taskId: this.taskId,
        }).then((data) => {
          this.selectedPipeList = data.data;
          // this.selectedPipeList = new Array(50).fill({
          //   id: Math.random(),
          //   pipeName: "平籍线A",
          //   pipeCode: null,
          //   pipeSegmentCode: "GE0401050300000282",
          //   pipeType: "净化气",
          // }).map((item,index) => ({ ...item,id: index }))
        })
      },
      syncItemStatus (uniqueKey = 'pipeSegmentCode') {
        this.$nextTick(() => {
          Misc.rawForEach(this.pipeList,this.selectedPipeList,uniqueKey,(item) => {
            this.$refs['leftTableRef'].toggleRowSelection(item,true);
          })
          // sync pipeList中最新的匹配数据
          this.selectedPipeList = Misc.rawMap(this.pipeList,this.selectedPipeList,uniqueKey)
        });
      },
      async bootstrap () {
        await this.getSelectedPipeList();
        await this.queryPipeList();
        this.loading = false
      },
      handleSelectAll () {
        this.pipeList.forEach((pipe) => {
          this.$refs['leftTableRef'].toggleRowSelection(pipe,true);
        });
      },
      handleSelectClear () {
        const findKey = 'pipeSegmentCode';
        Misc.rawForEach(this.pipeList,this.selectChooseList,findKey,(item) => {
          this.$refs['leftTableRef'].toggleRowSelection(item,false);
        })
        this.selectedPipeList = Misc.arrayOmit(this.selectedPipeList,this.selectChooseList,findKey)
      },
      handleSelectionChange (rows,type) {
        if (type === 'left') {
          this.selectedPipeList = rows;
        }
        if (type === 'right') {
          this.selectChooseList = rows;
        }
      },
      handleBack () {
        this.$router.push('/GhgqDiscern');
      },
      /**@description 下一步 */
      handleNext () {
        this.loading = true;
        console.log('handleNext-------------',this.selectedPipeList)
        Helper.pipeAddOrUpdate({
          pipeLineVos: this.selectedPipeList,
          taskId: this.taskId,
          taskName: this.taskName,
        })
          .then(() => {
            return Helper.nextStepOpr({
              taskId: this.taskId,
              nodeId: CURRENT_NODE_STEP,
              flag: 'next',
            });
          })
          .then(() => {
            this.$router.push({
              path: '/DiscernSteps/section',
              query: {
                id: this.taskId,
                taskName: this.taskName,
              },
            });
          })
          .finally(() => {
            this.loading = false;
          })
      },
      /**@description 一键识别 */
      handleDiscern () {
        this.loading = true;
        Helper.pipeAddOrUpdate({
          pipeLineVos: this.selectedPipeList,
          taskId: this.taskId,
          taskName: this.taskName,
        })
          .then(() => {
            return Helper.discernOneStep({
              taskId: this.taskId,
              nodeId: CURRENT_NODE_STEP,
            });
          })
          .then(() => {
            this.$router.push({
              path: '/DiscernSteps/discern',
              query: {
                id: this.taskId,
                taskName: this.taskName,
              },
            });
          })
          .finally(_ => {
            this.loading = false;
          })
      },
      onTableMaxHeight (value,tar = 'left') {
        this.leftMaxHeight = value;
      },
      calcIndex (index,pgCfg = 'leftPageCfg') {
        const { pageNo,pageSize } = this[pgCfg]
        return index + (pageNo - 1) * pageSize + 1
      },
      mapListeners (listeners,cb) {
        const res = {}
        for (const key in listeners) {
          if (Object.hasOwnProperty.call(listeners,key)) {
            const element = object[key];
            res[key] = (cb && cb(element)) || element
          }
        }
        return res
      }
    },
  };
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

          .el-table {
            margin: 0;
          }
        }
      }
    }
  }

  .choose-footer {
    // height: 70px;
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
