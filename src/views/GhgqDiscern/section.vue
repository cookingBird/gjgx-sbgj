<template>
  <div class="section-wrapper">
    <div class="section-top shadow-content bg-fff"></div>
    <div class="section-content">
      <div class="section-content-left shadow-content bg-fff">
        <el-scrollbar>
          <pipe-selector :data="pipeList" :defaultOpen="true"
            :optionsKey="{ title: 'name', key: 'id', children: 'children' }"></pipe-selector>
        </el-scrollbar>
      </div>
      <div class="section-content-right">
        <div class="right-content">
          <mix-table :columns="tableColumns" :api="tableRequestAPI" :config="tableConfig">
            <template #operate="{ row }">
              <el-button type="text">编辑分段</el-button>
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
        label: "管道名称",
        prop: ""
      }, {
        label: "分段编号",
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
        label: "管径（mm）",
        prop: ""
      }, {
        label: "压力",
        prop: ""
      }, {
        label: "传输介质",
        prop: "",
      }, {
        label: "易燃易爆场所（个）",
        prop: ""
      }, {
        label: "操作",
        prop: "operate"
      }],
      tableRequestAPI: function () { },

    }
  },
  methods: {
    handleDiscern() { },
    handleNext() {
      this.$router.push({
        path: '/DiscernSteps/level'
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