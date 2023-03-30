<template>
  <div class="tag-manage-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="标签名称" prop="keywords">
          <el-input
            v-model="searchForm.keywords"
            clearable
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="bged" @click="handleSearch">查询</el-button>
          <el-button class="bged" @click="handleAddTag">添加标签</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" border>
        <el-table-column
          type="index"
          width="100"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="标签名"
          align="center"
          width="300"
        ></el-table-column>
        <el-table-column
          label="组件数量"
          prop="count"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="包含组件"
          align="center"
          prop="moduleNames"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button size="small" type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo"
        :page-size="searchForm.pageSize"
        :total="searchForm.total"
        background
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getTagTableData, addTag, deleteTag } from "@/api/tag";

export default {
  data() {
    return {
      searchForm: {
        keyword: "",
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },

      tableData: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleUpdate(row) {
      this.$prompt("请输入标签名称", "修改标签", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.name,
      }).then(async ({ value }) => {
        if (value) {
          try {
            const { code } = await addTag({
              name: value,
              id: row.id,
            });
            if (code === 200) {
              this.$message.success("标签修改成功");
              this.getTableData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除此标签?", "操作提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        try {
          const { code } = await deleteTag({ id: row.id });
          if (code === 200) {
            this.$message.success("删除成功");
            this.getTableData();
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
    async getTableData() {
      try {
        const { code, data } = await getTagTableData(this.searchForm);
        if (code === 200) {
          this.searchForm.total = data.totalCount;
          this.tableData = data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleAddTag() {
      this.$prompt("请输入标签名称", "添加标签", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async ({ value }) => {
        if (value) {
          try {
            const { code } = await addTag({
              name: value,
            });
            if (code === 200) {
              this.$message.success("标签添加成功");
              this.getTableData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    handleSearch() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-manage-container {
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
    /deep/.el-form-item {
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