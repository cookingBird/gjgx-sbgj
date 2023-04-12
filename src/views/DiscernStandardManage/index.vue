<template>
<ContentLayout>
  <template v-slot:header>
    <div class="relative px-2 py-2 action-header-ctx">
      <el-input
        class="inline-block w-[192px]"
        placeholder="请输入标准名称"
        v-model="queryString"
      ></el-input>
      <el-button
        type="primary"
        @click="getData()"
      >查询</el-button>
      <el-button
        type="primary"
        @click="reset"
      >重置</el-button>
      <el-button
        class="absolute inline-block right-2"
        type="primary"
        @click="
            dialogType = 1;
            formData = {};
          "
      >
        新增
      </el-button>
    </div>
  </template>
  <template v-slot:main>
    <div class="w-full h-full p-2">
      <el-table
        v-observe:tableEmptyRow
        v-observe:tableWrapperFix
        class="my-el-table-ctx"
        :data="data"
        border
      >
        <el-table-column
          type="index"
          width="90"
          :index="calcIndex"
          label="序号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="标准名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="scope"
          label="适用范围"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="() => onDelete(scope)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              @click="() => onPreview(scope)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  <template v-slot:footer>
    <div class="flex items-center justify-center px-2 py-2">
      <el-pagination
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="pageState.pageNo"
        :page-size.sync="pageState.pageSize"
        @size-change="() => getData()"
        @current-change="() => getData()"
        @prev-click="() => getData()"
        @next-click="() => getData()"
        class="my-el-pagination-ctx"
        background
      ></el-pagination>
    </div>
  </template>
  <el-dialog
    v-if="formData"
    :title="dialogTitle"
    :visible="true"
    @close="formData = null"
    width="30%"
  >
    <el-form
      :model="formData"
      ref="addForm"
      label-width="110px"
      :rules="rules"
    >
      <el-form-item
        label="标准名称："
        prop="name"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="适用范围："
        prop="scope"
      >
        <el-input
          type="textarea"
          placeholder="请输入"
          :autosize="{ minRows: 3, maxRows: 5 }"
          class="h-20"
          v-model="formData.scope"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="选择标准："
        prop="file"
      >
        <input
          type="file"
          name="standardFile"
          accept=".doc,.docx,"
          @input="handleFileSelect"
        />
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          type="primary"
          @click="onSubmit"
        >确定</el-button>
        <el-button
          type="primary"
          @click="formData = null"
        >取消</el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog
    title="标准预览"
    v-if="pdf"
    :visible="true"
    class="dialog-preview"
    @close="pdf = null"
  >
    <pdf
      v-for="i in pdfPages"
      :key="i"
      :page="i"
      :src="pdf"
    />
  </el-dialog>
</ContentLayout>
</template>

<script>
  import pdf from 'vue-pdf';
  import ContentLayout from '../components/ContentLayout.vue';
  import * as Helper from './helper';
  export default {
    components: { ContentLayout,pdf },
    inject: ['appCtx'],
    data () {
      return {
        pageState: {
          pageNo: 1,
          pageSize: 10,
        },
        total: 100,
        data: [
          {
            standardName: '标准名称',
            suitRange: '适用范围',
          },
        ],
        queryString: '',
        dialogVisible: false,
        dialogType: 1,
        formData: null,
        pdfPages: 0,
        pdf: null,
      };
    },
    computed: {
      dialogTitle () {
        return this.dialogType === 1 ? '新增' : this.dialogType === 2 ? '修改' : '其它';
      },
      rules () {
        return this.dialogType === 1
          ? {
            name: [{ required: true,message: '请输入' }],
            scope: [{ required: true,message: '请输入' }],
            file: [{ required: true,message: '请选择' }],
          }
          : {
            name: [{ required: true,message: '请输入' }],
            scope: [{ required: true,message: '请输入' }],
          };
      },
    },
    created () {
      this.getData();
    },
    methods: {
      reset () {
        this.queryString = '';
        this.getData();
      },
      getData (query = this.buildListData()) {
        Helper.query(query).then((res) => {
          const { data,totalCount } = res;
          this.data = data;
          this.total = totalCount;
        });
      },
      buildListData () {
        return {
          'keyWords': this.queryString,
          'pageNo': this.pageState.pageNo,
          'pageSize': this.pageState.pageSize,
        };
      },
      onSubmit () {
        this.$refs.addForm.validate().then((res) => {
          Helper.addOrUpdate(this.formData)
            .then((_) => {
              this.$message.success(this.dialogType === 1 ? '新增成功' : '修改成功');
              this.formData = null;
            })
            .then(() => {
              this.getData();
            });
        });
      },
      onDelete (scope) {
        const { row } = scope;
        Helper.remove(row.id)
          .then((_) => {
            this.$message.success('删除成功');
          })
          .then(() => {
            this.getData();
          });
      },
      onPreview ({ row }) {
        console.log('onPreview',row);
        this.loadPdf(row.pdfPath);
        // Helper.renderPdf(row.pdfPath,"discern-standard-preview")
      },
      handleFileSelect (e) {
        this.formData = {
          ...this.formData,
          file: e.target.files[0],
        };
      },
      onEdit (row) {
        this.dialogType = 2;
        setTimeout(() => {
          this.formData = row;
        });
      },
      loadPdf (src) {
        this.pdf = pdf.createLoadingTask(src);
        this.pdf.promise.then((pdf) => {
          this.pdfPages = pdf.numPages;
        });
      },
      calcIndex (index,pgCfg = 'pageState') {
        const { pageNo,pageSize } = this[pgCfg]
        return index + (pageNo - 1) * pageSize + 1
      }
    },
  };
</script>

<style>
  .el-input-file .el-input__inner {
    border: none;
    padding: 5px 3px;
  }

  .dialog-preview.el-dialog__wrapper .el-dialog {
    height: calc(100% - 7vh - 50px);
    margin-top: 7vh !important;
    overflow-y: hidden;
  }

  .dialog-preview.el-dialog__wrapper .el-dialog__header {
    border-bottom: 2px solid #eee;
  }

  .dialog-preview.el-dialog__wrapper .el-dialog__body {
    height: 100%;
    overflow-y: scroll;
  }
</style>
