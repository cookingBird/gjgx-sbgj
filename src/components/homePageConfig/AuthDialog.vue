<template>
<el-dialog
  title="权限设置"
  width="1400px"
  :visible.sync="visible"
  append-to-body
  :close-on-click-modal="false"
  @close="handleClose"
>
  <div class="auth-dialog-content">
    <div class="content-left">
      <div class="left-header">选择机构</div>
      <div class="left-content">
        <el-scrollbar>
          <el-tree
            :data="orgTree"
            :props="{
              children: 'children',
              label: 'orgName'
            }"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="content-center">
      <div class="center-header">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入机构名称"
          clearable
        ></el-input>
        <el-select
          v-model="searchForm.orgType"
          placeholder="请选择机构类型"
          clearable
        >
          <el-option
            v-for="(item, idx) in orgTypeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="searchForm.orgIndex"
          placeholder="请选择机构标志"
          clearable
        >
          <el-option
            v-for="(item, idx) in orgIndexList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-checkbox
          v-model="searchForm.queryChild"
          label="包含下级机构"
          :true-label="1"
          :false-label="0"
          border
        ></el-checkbox>
        <el-button
          type="primary"
          size="small"
          @click="pageCurrentChange(1)"
        >搜索</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSelectAll"
        >选中所有机构</el-button>
      </div>
      <div
        class="center-content"
        v-loading="tableLoading"
      >
        <el-table
          ref="table"
          :data="tableData"
          :height="'100%'"
          row-key="orgCode"
          border
          @selection-change="handleTableSection"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            reserve-selection
          ></el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            label="机构名称"
            prop="orgName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="上级机构"
            prop="porgName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="机构类型"
            prop="orgType"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ orgTypeName(scope.row.orgType) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="center-footer">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="searchForm.pageSize"
          @current-change="pageCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <div class="content-right">
      <div class="right-header">已选机构列表：</div>
      <div class="right-content">
        <el-scrollbar>
          <div
            class="selected-item"
            v-for="item in selectedTableRows"
            :key="item.id"
            @click="removeSelection(item)"
          >
            <span>{{ item.orgName }}</span>
          </div>
        </el-scrollbar>
      </div>
      <div class="right-footer">
        <el-button
          size="small"
          type="primary"
          @click="handleClearSelection"
        >清空</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleConfirm"
        >保存</el-button>
      </div>
    </div>
  </div>
</el-dialog>
</template>


<script>
  import {
    getOrgOption,
    getOrgTableData
  } from "@/api/index";
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    name: 'auth-dialog',
    data () {
      return {
        visible: false,
        tableLoading: false,
        searchForm: {
          keyword: '',
          orgType: '',
          orgIndex: '',
          queryChild: 0,
          orgId: '',
          pageSize: 10,
          pageNo: 1
        },
        orgTree: [],
        tableData: [],
        total: 0,
        selectedTableRows: [],
      }
    },
    computed: {
      orgTypeList () {
        return [{
          label: '机关单位',
          value: 1
        },{
          label: '职能部门',
          value: 2
        },{
          label: '生产部门',
          value: 3
        },{
          label: '罗辑分组',
          value: 4
        }];
      },
      orgIndexList () {
        return [{
          label: '二级单位',
          value: 2
        },{
          label: '三级单位',
          value: 3
        }];
      },
      orgTypeName () {
        return function (val) {
          let res = this.orgTypeList.filter(item => item.value == val);
          return res[0] ? res[0].label : '';
        }
      }
    },
    watch: {
      'searchForm.orgId': function (val) {
        if (val) {
          this.getTableData();
        }
      }
    },
    created () {
      this.getOrgTree();
    },
    methods: {
      async open (org) {
        this.visible = true;
        await this.getTableData();
        if (Array.isArray(org) && org.length) {
          this.$nextTick(() => {
            const o = cloneDeep(org);
            this.toggleSelection(o);
          })
        }
      },
      handleClose () {
        this.searchForm = {
          keyword: '',
          orgType: '',
          orgIndex: '',
          queryChild: 0,
          orgId: '',
          pageSize: 10,
          pageNo: 1
        }
        this.tableData = [];
        this.handleClearSelection();
      },
      toggleSelection (rows,checked = true) {
        if (rows instanceof Array && rows.length) {
          rows.forEach(row => {
            const tableRow = this.tableData.find((item) => item.id === row.id) || row;
            this.$refs['table'].toggleRowSelection(tableRow,checked);
          });
        } else {
          this.$refs['table'].clearSelection();
        }
      },
      removeSelection (row) {
        this.toggleSelection([row],false)
      },
      handleClearSelection () {
        this.$refs['table'].clearSelection();
      },
      handleTableSection (selection) {
        this.selectedTableRows = selection;
      },
      handleNodeClick ({ id }) {
        this.searchForm.orgId = id;
      },
      handleConfirm () {
        this.$emit('confirm',cloneDeep(this.selectedTableRows));
        this.visible = false;
      },
      async getOrgTree () {
        const { code,data } = await getOrgOption();
        if (code === 200) {
          this.orgTree = data;
        }
      },
      async getTableData () {
        this.tableLoading = true;
        const { code,data } = await getOrgTableData(this.searchForm);
        this.tableLoading = false;
        if (code === 200) {
          this.tableData = data.data;
          this.total = data.totalCount;
        }
      },
      pageCurrentChange (val) {
        this.searchForm.pageNo = val;
        this.getTableData();
      },
      async handleSelectAll () {
        const loading = this.$loading({
          text: "数据加载中...",
          background: 'rgba(0,0,0,0.7)'
        })
        const { code,data } = await getOrgTableData({
          queryChild: 1,
          pageNo: 1,
          pageSize: -1,
          orgId: this.$store.state.auth.userinfo.orgId
        });
        loading.close();
        if (code === 200) {
          this.toggleSelection(data.data);
        }
      },
    }

  }
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #05366f;

  .el-dialog__title,
  .el-dialog__close {
    color: #fff;
  }
}

.auth-dialog-content {
  display: flex;
  height: 610px;

  ::v-deep .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  >div {
    height: 100%;
  }

  .content-left {
    width: 200px;

    .left-header {
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      background: #EEF2F6;
    }

    .left-content {
      height: calc(100% - 40px);
      width: 100%;

      .el-scrollbar {
        height: 100%;
      }
    }

  }

  .content-center {
    flex: 1;
    margin: 0 10px;

    .center-header {

      .el-input,
      .el-select {
        width: 150px;
        margin-right: 10px;
      }

      .el-checkbox {
        margin-right: 10px;
      }
    }

    .center-content {
      height: calc(100% - 80px);

      ::v-deep .el-table {
        thead {
          .el-table__cell {
            background: #E6F7FF !important;
            color: #063770;
          }
        }

      }
    }

    .center-footer {
      text-align: center;
      margin-top: 10px;

      ::v-deep .el-pager {
        li.active {
          color: #409EFF;
        }

        li:hover {
          color: #409EFF;
        }
      }
    }
  }

  .content-right {
    width: 200px;

    .right-header {
      height: 40px;
      line-height: 40px;
    }

    .right-content {
      background: #E6F7FF;
      height: calc(100% - 80px);
      width: 100%;

      .el-scrollbar {
        height: 100%;

        .selected-item {
          padding-top: 6px;
          padding-left: 6px;
          cursor: pointer;
        }
      }
    }

    .right-footer {
      padding: 10px;
      padding-right: 0;
      text-align: right;

      button {
        height: auto;
      }
    }
  }

}
</style>
