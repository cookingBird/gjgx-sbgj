<template>
  <div class="ComponentRegistration">
    <div class="seach">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="组件类别" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择组件类别" filterable>
            <el-option
              :value="item.value"
              v-for="item in zjlb"
              :key="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件私密性" prop="secretFlag">
          <el-select
            v-model="searchForm.secretFlag"
            placeholder="请选择组件私密性"
            filterable
          >
            <el-option
              :value="item.value"
              v-for="item in zjsmx"
              :key="item.value"
              :label="item.name"
            ></el-option>
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
          <el-button class="bged" @click="onSubmit">查询</el-button>
          <el-button class="bged" @click="enroll">注册组件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <ul class="concent" v-loading="loading">
      <li class="box" v-for="item in boxlist" :key="item.id">
        <el-image :src="item.image" fit="cover"></el-image>
        <div class="box-bottom">
          <h4>{{ item.name }}</h4>
          <div class="btns">
            <el-button size="mini" class="bged" @click="editor(item)"
              >编辑</el-button
            >
            <el-button size="mini" class="bgdel" @click="del(item)"
              >删除</el-button
            >
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
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <Dialog ref="dialog" @onConfirm="getComponentsList" />
  </div>
</template>

<script>
import Dialog from "@/components/cp/dialog.vue";
import { getComponentsListApi, componentDelete } from "@/api/index";

export default {
  namw: "ComponentRegistration",
  components: {
    Dialog,
  },
  data() {
    return {
      loading: false,
      total: 0,
      zjlb: [
        { name: "全部", value: "" },
        { name: "系统组件", value: 1 },
        { name: "第三方组件", value: 2 },
      ],
      zjsmx: [
        { name: "全部公开", value: 1 },
        { name: "部分公开", value: 2 },
        { name: "仅我可见", value: 3 },
      ],
      boxlist: [],
      searchForm: {
        keywords: "",
        type: "",
        secretFlag: "",
        pageSize: 12,
        pageNo: 1,
      },
    };
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
          this.boxlist = data.data;
          this.total = data.totalCount;
        }
        console.log(code, data);
      } catch (err) {
        console.log(err);
      }
    },
    onSubmit() {
      this.searchForm.pageNo = 1;
      this.getComponentsList();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.getComponentsList();
    },
    enroll() {
      this.$refs.dialog.open();
    },
    editor(formData) {
      this.$refs.dialog.open(formData);
    },
    del({ id }) {
      this.$confirm("此操作将永久删除该组件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          const { code } = await componentDelete({ id });
          if (code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getComponentsList();
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ComponentRegistration {
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

    ::v-deep .el-form-item {
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

      .el-image {
        width: 100%;
        height: calc(100% - 45px);
        padding: 10px;
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
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
