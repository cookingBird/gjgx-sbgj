<template>
<div class="choose-wrapper">
  <div class="space-x-2 choose-content">
    <div class="flex-grow-0 flex-shrink-0 w-5/12 rounded">
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
            row-key="pipeSegmentCode"
            border
            :data="pipeList"
            @select="(val)=>onHandSelect(val,'left')"
            @select-all="onSelectAll"
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
            :pager-count="5"
            @size-change="queryPipeList"
            @current-change="queryPipeList"
            @prev-click="queryPipeList"
            @next-click="queryPipeList"
            background
            small
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
          <MyTable
            :data="selectedListFiltered"
            @select="(val)=>onHandSelect(val,'right')"
            :columns="rightCols"
          >
          </MyTable>
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
  import * as Misc from '@/utils/misc';
  import MyTable from '@/components/MyTable.vue';
  import createLoading from '@/utils/Loading/loading';
  import { debounce } from '@/utils/misc';
  const CURRENT_NODE_STEP = 1;
  const uniqueKey = 'pipeSegmentCode';

  export default {
    components: { MyTable },
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
          { width: 55,type: 'index',align: 'center',label: '序号' },
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
            width: 160,
            align: 'center',
            prop: 'hydrogenSulfideMolPercent',
            label: '硫化氢(mol)百分比',
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
            width: 120,align: 'center',prop: 'leakPipeCapacity',label: '泄露管段管容',
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
            width: 120,align: 'center',prop: 'leakEstimate',label: '泄露时间估算',
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
        loading: false,
        selectChooseList: []
      };
    },
    computed: {
      taskId () {
        return this.$route.query.taskId;
      },
      taskName () {
        return this.$route.query.taskName;
      },
      selectedListFiltered () {
        const filterKey = 'pipeName'
        return this.selectedPipeList
          .filter((node) => node[filterKey] && node[filterKey].includes(this.rightKeyword));
      },
    },
    watch: {
      loading: {
        handler (val,oldVal) {
          if (!this.loadingMask) {
            this.loadingMask = createLoading.call(
              this,
              void 0,
              {
                customClass: 'gislife-loading',
              }
            );
          }
          if (val) {
            let text = void 0;
            switch (this.loadingType) {
              case 'bootstrap': {
                text = '';
                break;
              }
              case 'handleDiscern': {
                text = '一键识别中...';
                break;
              }
              case 'handleNext': {
                text = '分段识别中...';
                break;
              }
            }
            this.loadingMask.start({ text,progress: Boolean(text) })
          } else {
            this.loadingMask.end();
          }
        }
      },
    },
    created () {
      const loadingFuncs = [
        'bootstrap',
        'handleDiscern',
        'handleNext'
      ];
      loadingFuncs.forEach((key) => {
        /**@description 栈溢出 */
        // this[key] = Misc.bindLoading.call(this,'loading',(...param) => this[key](...param),() => {
        //   this.loadingType = key
        // })
        //！ OK
        this[key] = Misc.bindLoading.call(this,'loading',this[key],() => {
          this.loadingType = key
        })
      });
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
        })
          .then((data) => {
            this.leftPageCfg = {
              ...this.leftPageCfg,
              total: data.totalCount,
            };
            this.pipeList = data.data
              .map(item => ({
                ...item,
                pageNo: pageNo,
              }));
            this.patchPipeStatusAndSelected()
          });
      },
      getSelectedPipeList () {
        return Helper.queryAllSelected({
          taskId: this.taskId,
        }).then((res) => {
          this.selectedPipeList = res.data;
        })
      },
      async bootstrap () {
        await this.getSelectedPipeList();
        await this.queryPipeList();
      },
      /**@description 每次请求数据初始化每一行的状态 */
      patchPipeStatusAndSelected () {
        setTimeout(() => {
          //同步表格状态
          Misc.rawForEach(this.pipeList,this.selectedPipeList,(item) => {
            console.log('rawForEach----------',item);
            if (item) {
              this.$refs['leftTableRef'].toggleRowSelection(item,true);
            }
          },uniqueKey);
          // 同步每条选中数据的页码信息；
          this.selectedPipeList = Misc.rawMap(
            this.selectedPipeList,
            this.pipeList,
            uniqueKey);
        })
      },
      /**@description 左侧切换全选和取消全选状态 */
      handleSelectAll () {
        this.$refs['leftTableRef'].toggleAllSelection();
      },
      /**@description 取消左侧选择 */
      handleSelectClear () {
        Misc.rawForEach(this.pipeList,this.selectChooseList,(item) => {
          this.$refs['leftTableRef'].toggleRowSelection(item,false);
        },uniqueKey)
        this.selectedPipeList = Misc.arrayOmit(
          this.selectedPipeList,
          this.selectChooseList,
          uniqueKey)
      },
      /**@description 用户选择点击checkbox事件 */
      onHandSelect (rows,type) {
        if (type === 'left') {
          /**Patch selected rows*/
          this.selectedPipeList =
            Misc.replaceFiledItems(
              this.selectedPipeList,
              'pageNo',
              this.leftPageCfg.pageNo,
              rows,
            );
        }
        if (type === 'right') {
          this.selectChooseList = rows;
        }
      },
      /**@description 全选 */
      onSelectAll (rows) {
        console.log("handleSelectAll----------",rows);
        this.selectedPipeList =
          Misc.replaceFiledItems(
            this.selectedPipeList,
            'pageNo',
            this.leftPageCfg.pageNo,
            rows,
          );
      },
      handleBack () {
        this.$router.push('/GhgqDiscern');
      },
      /**@description 下一步 */
      handleNext () {
        console.log("selectedPipeList---------------",this.selectedPipeList);
        return Helper.pipeAddOrUpdate({
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
                taskId: this.taskId,
                taskName: this.taskName,
              },
            });
          })
      },
      /**@description 一键识别 */
      handleDiscern () {
        return Helper.pipeAddOrUpdate({
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
                taskId: this.taskId,
                taskName: this.taskName,
              },
            });
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
        // width: calc(50% - 5px);
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
