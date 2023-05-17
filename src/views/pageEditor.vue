<template>
  <div class="homepage-config-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="组件类别" prop="type">
          <el-select v-model="searchForm.type">
            <el-option label="全部" value=""></el-option>
            <el-option label="系统组件" :value="1"></el-option>
            <el-option label="第三方组件" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件私密性" prop="secretFlag">
          <el-select v-model="searchForm.secretFlag">
            <el-option label="全部公开" :value="1"></el-option>
            <el-option label="部分公开" :value="2"></el-option>
            <el-option label="仅我可见" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件名称" prop="keywords">
          <el-input
            v-model="searchForm.keywords"
            placeholder="请输入组件名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="bged" @click="handleSearch">查询</el-button>
          <el-button class="bged" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <div class="content-left">
        <div class="content-header">首页配置</div>
        <config-panel />
      </div>
      <div class="content-right">
        <div class="content-header">组件库</div>
        <el-scrollbar>
          <ul class="component-store" v-loading="loading">
            <li
              class="component-item"
              v-for="item in componentsList"
              :key="item.code"
              :draggable="true"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragEnd"
            >
              <div class="component-header">{{ item.name }}</div>
              <div class="component-content">
                <img :src="item.image" alt="" />
                <div class="component-infos">
                  <p><span>组件类别：</span>{{ item.typeName }}</p>
                  <p><span>私密性：</span>{{ item.secretFlagName }}</p>
                  <p><span>公开对象：</span>{{ item.secretFlagName }}</p>
                  <p>
                    <span>组件尺寸：</span
                    >{{ `${item.xcoordinate}X${item.ycoordinate}` }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>

import ConfigPanel from "@/components/editor/panel";
import { getComponentsListApi } from "@/api/index";

export default {
  data() {
    return {
      searchForm: {
        type: "",
        secretFlag: 1,
        keywords: "",
        pageNo: 1,
        pageSize: -1,
      },
      componentsList: [],
      dragingComponent: null,
      loading: false,
    };
  },
  components: {
    ConfigPanel,

  },
  created() {
    this.getComponentsList();
  },
  methods: {
    async getComponentsList() {
      try {
        this.loading = true;
        const { code, data } = await getComponentsListApi(this.searchForm);
        this.loading = false;
        if (code === 200) {
          this.componentsList = data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleSearch() {
      this.getComponentsList();
    },
    handleDragStart(component) {
      this.dragingComponent = component;
    },
    handleDragEnd() {
      this.dragingComponent = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.homepage-config-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .search {
    width: 100%;
    padding: 0 12px;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 10px;

    ::v-deep .el-form-item {
      margin: 0;
      margin-right: 20px;
    }
  }

  .content {
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 1%;
    height: calc(100% - 60px);
    padding: 0;
    align-content: flex-start;

    > div {
      background-color: #fff;
      height: 100%;

      .content-header {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        font-size: 16px;
        color: #666;
        font-weight: 700;
        border-bottom: 1px solid #ddd;
      }
    }

    .content-left {
      flex: 1;
    }

    .content-right {
      width: 384px;
      margin-left: 10px;

      ::v-deep .el-scrollbar {
        height: 720px;

        .el-scrollbar__wrap {
          overflow-x: hidden;
        }

        .component-store {
          padding: 0 10px;

          .component-item {
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 10px;
            cursor: pointer;

            .component-header {
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
              font-size: 14px;
              font-weight: 700;
              color: #666;
              border-bottom: 1px solid #ddd;
            }

            .component-content {
              padding: 10px;
              display: flex;

              img {
                width: 178px;
                height: 120px;
              }

              .component-infos {
                margin-left: 10px;
                cursor: pointer;

                p {
                  line-height: 29px;

                  span {
                    font-weight: 700;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>