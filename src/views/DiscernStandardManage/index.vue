<template>
<ContentLayout v-loading="loading">
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
      <Auth :funCode="'DiscernStandardManage_add'">
        <el-button
          class="absolute inline-block right-2"
          type="primary"
          @click="onAdd"
        >
          新增
        </el-button>
      </Auth>
    </div>
  </template>
  <template v-slot:main>
    <div class="w-full h-full p-2">
      <el-table
        class="my-el-table-ctx"
        :data="data"
        height="100%"
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
            <Auth :funCode="'DiscernStandardManage_edit'">
              <el-button
                type="text"
                @click="onEdit(scope.row)"
              >
                编辑
              </el-button>
            </Auth>
            <Auth :funCode="'DiscernStandardManage_delete'">
              <el-button
                type="text"
                @click="() => onDelete(scope)"
              >
                删除
              </el-button>
            </Auth>
            <el-button
              type="text"
              @click="() => onPreview(scope)"
            >
              预览
            </el-button>
            <el-button
              type="text"
              @click="() => onDownload(scope)"
            >
              下载
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
    :close-on-click-modal="false"
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
        <Upload
          ref="upload"
          :fileName="formData.fileName"
          @input="handleFileSelect"
        />
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          type="primary"
          :loading="submitLoading"
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
    :close-on-click-modal="false"
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
  import * as Misc from '@/utils/misc';
  import Upload from '@/components/Upload.vue';
  import createLoading from '@/utils/Loading/loading';


  export default {
    components: { ContentLayout, pdf, Upload },
    inject: ['appCtx'],
    data() {
      return {
        pageState: {
          pageNo: 1,
          pageSize: 10,
        },
        total: 100,
        data: [],
        rules: {
          name: [{ required: true, message: '请输入' }],
          scope: [{ required: true, message: '请输入' }],
          file: [{ required: true, message: '请选择' }],
        },
        queryString: '',
        dialogVisible: false,
        dialogType: 1,
        formData: null,
        pdfPages: 0,
        pdf: null,
        loading: false,
        submitLoading: false
      };
    },
    computed: {
      dialogTitle() {
        return this.dialogType === 1 ? '新增' : this.dialogType === 2 ? '修改' : '其它';
      },
    },
    watch: {
      formData(val) {
        if (val === null) {
          // this.progress.end();
        }
      },
      loading: {
        handler(val) {
          if (!this.loadingMask) {
            this.loadingMask = createLoading.call(
              this,
              void 0,
              {
                customClass: 'gislife-loading',
                text: '',
              }
            );
          }
          if (val) {
            this.loadingMask.start()
          } else {
            this.loadingMask.end();
          }
        }
      },
    },
    created() {
      const loadingFuncs = ['onDelete', 'getData'];
      loadingFuncs.forEach((key) => {
        /**注意此处容易造成死循环，当bindLoading第二个参数为函数时 */
        this[key] = Misc.bindLoading.call(this, 'loading', this[key])
      });
      ['onSubmit'].forEach((key) => {
        /**注意此处容易造成死循环，当bindLoading第二个参数为函数时 */
        this[key] = Misc.bindLoading.call(this, 'submitLoading', this[key])
      });
    },
    mounted() {
      this.getData();
    },
    methods: {
      reset() {
        this.queryString = '';
        this.getData();
      },
      getData(query = this.buildListData()) {
        Helper.query(query).then((res) => {
          const { data, totalCount } = res;
          this.data = data;
          this.total = totalCount;
        });
      },
      buildListData() {
        return {
          'keyWords': this.queryString,
          'pageNo': this.pageState.pageNo,
          'pageSize': this.pageState.pageSize,
        };
      },
      onSubmit() {
        return this.$refs.addForm.validate().then((res) => {
          this.$refs.upload.start();
          return Helper.addOrUpdate(this.formData)
            .then((_) => {
              this.$message.success(this.dialogType === 1 ? '新增成功' : '修改成功');
            })
            .then(() => {
              this.getData();
            })
            .finally(_ => {
              this.$refs.upload.end();
              setTimeout(() => {
                this.formData = null;
              }, 300)
            })
        });
      },
      onDelete(scope) {
        return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(_ => {
            const { row } = scope;
            return Helper.remove(row.id)
          })
          .then(
            (_) => {
              this.$message.success('删除成功');
            },
            (_) => {
              this.$message.success('取消删除');
              return Promise.reject()
            }
          )
          .then(() => {
            this.getData();
          });
      },
      onPreview({ row }) {
        this.loadPdf(row.pdfPath);
        // Helper.renderPdf(row.pdfPath,"discern-standard-preview")
      },
      onAdd() {
        this.dialogType = 1;
        this.formData = {};
      },
      handleFileSelect(files) {
        this.formData = {
          ...this.formData,
          file: files[0],
        };
      },
      onEdit(row) {
        this.dialogType = 2;
        this.formData = row;
        console.log("onEdit---------------", row);
      },
      loadPdf(src) {
        this.pdf = pdf.createLoadingTask(src);
        this.pdf.promise.then((pdf) => {
          this.pdfPages = pdf.numPages;
        });
      },
      calcIndex(index, pgCfg = 'pageState') {
        const { pageNo, pageSize } = this[pgCfg]
        return index + (pageNo - 1) * pageSize + 1
      },
      onDownload({ row }) {
        if (row.filePath) {
          Misc.downloadURL(row.filePath, row.fileName)
        } else {
          this.$message.error('不存在标准文件')
        }
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

  input[accept=".doc,.docx,"] {
    padding: 0;
    line-height: 24px;
    cursor: pointer;
  }

  input[accept=".doc,.docx,"]::placeholder {
    display: none;
  }

  /** q: 帮我写一个动画 */
</style>
