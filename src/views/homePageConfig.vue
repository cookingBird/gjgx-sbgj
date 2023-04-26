<template>
<div class="HomePage">
  <div class="seach">
    <el-form
      :inline="true"
      :model="searchForm"
    >
      <el-form-item
        label="页面类别"
        prop="classType"
      >
        <el-select
          v-model="searchForm.classType"
          placeholder="请选择页面类别"
          filterable
          clearable
        >
          <el-option
            label="公共"
            :value="0"
          ></el-option>
          <el-option
            label="个人"
            :value="1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="页面状态"
        prop="status"
      >
        <el-select
          v-model="searchForm.status"
          placeholder="请选择页面状态"
          filterable
          clearable
        >
          <el-option
            label="启用"
            :value="0"
          ></el-option>
          <el-option
            label="停用"
            :value="1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="页面名称"
        prop="keyword"
      >
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入页面名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="bged"
          @click="handleCurrentChange(1)"
        >查询</el-button>
        <el-button
          class="bged"
          @click="openPageDialog(0)"
        >新增公共配置</el-button>
        <el-button
          class="bged"
          @click="openPageDialog(1)"
        >新增个人配置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <ul
    class="concent"
    v-loading="loading"
  >
    <li
      class="box"
      v-for="item in pageList"
      :key="item.id"
    >
      <el-image
        :src="item.routeImage"
        fit="cover"
      >
        <div
          slot="error"
          class="image-slot"
        ><span>暂无配置</span></div>
      </el-image>
      <div class="box-bottom">
        <h4>{{ item.name }}</h4>
        <div class="page-controller">
          <el-radio
            v-model="item.defaultFlag"
            @change="setDefaultPage(item)"
            :label="1"
          >默认</el-radio>
          <el-checkbox
            v-model="item.status"
            :true-label="0"
            :false-label="1"
            @change="(val) => setPageStatus(item, val)"
          >启用</el-checkbox>
        </div>
        <div class="page-btnbox">
          <i
            class="el-icon-view"
            title="查看"
            @click="handlePagePreview(item)"
          ></i>
          <i
            class="el-icon-setting"
            title="配置"
            @click="handlePageConfig(item)"
          ></i>
          <i
            class="el-icon-edit"
            title="编辑"
            @click="handlePageEdit(item)"
          ></i>
          <i
            class="el-icon-delete"
            title="删除"
            @click="handlePageDelete(item)"
          ></i>
        </div>
      </div>
    </li>
  </ul>
  <div class="pagination">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNo"
      :page-size="searchForm.pageSize"
      :total="total"
      background
      layout="total, prev, pager, next"
      prev-text="上一页"
      next-text="下一页"
    >
    </el-pagination>
  </div>
  <page-dialog
    ref="page-dialog"
    @confirm="handlePageConfirm"
  ></page-dialog>
  <page-preview
    ref="previewRef"
    :layout="pageLayout"
  ></page-preview>
</div>
</template>

<script>

  import { getPageList,updatePageFlag,deletePageById,getPageConfig } from '@/api/index';
  import PageDialog from '@/components/homePageConfig/PageDialog';
  import PagePreview from '@/components/homePageConfig/Preview.vue';

  export default {
    name: 'HomePageConfig',
    components: {
      PageDialog,
      PagePreview
    },
    data () {
      return {
        searchForm: {
          classType: '',
          status: '',
          pageNo: 1,
          pageSize: 8
        },
        pageList: [],
        loading: false,
        total: 0,
        pageLayout: [],
      }
    },
    created () {
      this.getListData();
    },
    methods: {
      async getListData () {
        this.loading = true;
        const { code,data } = await getPageList(this.searchForm);
        this.loading = false;
        if (code === 200) {
          this.pageList = data.data;
          this.total = data.totalCount;
        }
      },
      handleCurrentChange (val) {
        this.searchForm.pageNo = val;
        this.getListData();
      },
      handlePageConfirm () {
        this.getListData();
        this.$store.dispatch('auth/getViewPageList');
      },
      openPageDialog (param) {
        this.$refs['page-dialog'].open(param);
      },
      //页面预览
      async handlePagePreview ({ id }) {
        const { code,data } = await getPageConfig({ pageId: id });
        if (code === 200) {
          this.pageLayout = data;
          this.$refs['previewRef'].open();
        }
      },
      //页面配置
      handlePageConfig ({ id }) {
        this.$router.push({
          path: '/editor',
          query: {
            id
          }
        })
      },
      //页面编辑
      handlePageEdit (data) {
        this.$refs['page-dialog'].open(data);
      },
      //页面删除
      handlePageDelete ({ id }) {
        this.$confirm('确认删除此页面?','操作提示',{
          type: "warning"
        }).then(async () => {
          const { code,data } = await deletePageById({ pageId: id });
          if (code === 200) {
            this.$message.success(data);
            this.getListData();
            this.$store.dispatch('auth/getViewPageList');
          }
        },() => { })
      },
      //设置默认页面
      async setDefaultPage ({ id }) {
        const { code,data } = await updatePageFlag({
          pageId: id,
          defaultFlag: 1
        })
        if (code === 200) {
          this.getListData();
          this.$store.dispatch('auth/getViewPageList');
        }
      },
      //设置页面启用禁用状态
      async setPageStatus ({ id },status) {
        const { code,data } = await updatePageFlag({
          pageId: id,
          status
        })
        if (code === 200) {
          this.getListData();
          this.$store.dispatch('auth/getViewPageList');
        }
      },
    }
  }
</script>


<style lang="scss" scoped>
  .HomePage {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .seach {
      width: 100%;
      padding: 0 12px;
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #fff;
      margin-bottom: 10px;

      /deep/.el-form-item {
        margin: 0;
        margin-right: 20px;
      }
    }

    .concent {
      overflow: hidden;
      background-color: #fff;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 1%;
      height: calc(100% - 140px);
      align-content: flex-start;

      .box {
        margin-left: 1%;
        width: 24%;
        height: 210px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        margin-top: 6px;
        margin-bottom: 6px;

        ::v-deep .el-image {
          width: 100%;
          height: calc(100% - 45px);
          padding: 10px;
          position: relative;

          .image-slot {
            position: absolute;
            left: 50%;
            top: 50%;
            text-align: center;
            transform: translate(-50%, -50%);
            font-size: 16px;
          }
        }

        .box-bottom {
          height: 40px;
          margin-top: 4px;
          border-top: 1px solid rgb(200, 198, 198);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;

          h4 {
            width: 114px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 2; //行数
          line-clamp: 2;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
        }

        .page-controller {
          .el-radio {
            margin-right: 10px;
          }
        }

        .page-btnbox {
          i {
            font-size: 20px;
            margin-right: 8px;
            color: #d9d9d9;
            cursor: pointer;
          }
        }
      }

      .btns {
        button {
          height: auto;
        }
      }
    }
  }

  .pagination {
    height: 60px;
    margin-top: 10px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
