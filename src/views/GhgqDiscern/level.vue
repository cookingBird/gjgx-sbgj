<template>
  <div class="level-wrapper">
    <div class="level-top shadow-content bg-fff"></div>
    <div class="level-content">
      <div class="level-content-left shadow-content bg-fff">
        <el-scrollbar>
          <pipe-selector :data="pipeList" :defaultOpen="true"
            :optionsKey="{ title: 'name', key: 'id', children: 'children' }"></pipe-selector>
        </el-scrollbar>
      </div>
      <div class="level-content-right">
        <div class="right-content">
          <mix-table :columns="tableColumns" :api="tableRequestAPI" :config="tableConfig">
            <template #operate="{ row }">
              <el-button type="text">修改等级</el-button>
            </template>
          </mix-table>
        </div>
        <div class="right-footer bg-fff shadow-content m-t-10">
          <div>
            <el-button @click="$router.go(-1)">上一步</el-button>
            <el-button type="primary" @click="handleDiscern">一键识别</el-button>
            <el-button type="primary" @click="handleNext">下一步</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MixTable from '@/components/mixTable';
import PipeSelector from '@/components/pipeSelector';

export default {
  components: {
    MixTable,
    PipeSelector
  },
  data() {
    return {
      pipeList: [{
        name: '全部管道',
        id: 1,
        children: [{
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道4',
          id: 5
        }, {
          name: '管道1',
          id: 2,
        }, {
          name: '管道2',
          id: 3
        }, {
          name: '管道3',
          id: 4
        }, {
          name: '管道4',
          id: 5
        }]
      }],
      tableConfig: {
        isPagination: false,
      },
      tableColumns: [{
        label: "所属管线",
        prop: ""
      }, {
        label: "分段编号",
        prop: ""
      }, {
        label: "地区等级",
        prop: ""
      }, {
        label: "分段长度（m）",
        prop: ""
      }, {
        label: "起始里程（m）",
        prop: ""
      }, {
        label: "终止里程（m）",
        prop: ""
      }, {
        label: "人居（户）",
        prop: ""
      }, {
        label: "特定场所（个）",
        prop: "",
      }, {
        label: "易燃易爆场所（个）",
        prop: ""
      }, {
        label: "操作",
        prop: "operate"
      }],
      tableRequestAPI: function () { }
    }
  },
  methods:{
    handleDiscern(){},
    handleNext(){
      this.$router.push({
        path:'/DiscernSteps/discern'
      })
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
      width: 340px;
      height: 100%;
      margin-right: 10px;
      padding: 8px;
     ::v-deep .el-scrollbar{
        height: 100%;
        background-color: #EEF2F6;
        .el-scrollbar__wrap{
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