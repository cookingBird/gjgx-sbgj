<template>
<main class="flex flex-col">
  <div class="flex-grow-0 flex-shrink-0 rounded search-bar shadow-content">
    <el-form
      class="relative"
      :model="searchForm"
      :inline="true"
    >
      <el-form-item>
        <el-input
          v-model="searchForm.keyWords"
          placeholder="请输入任务名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchForm.status"
          placeholder="请选择识别状态"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.time"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="$refs.table.refresh()"
        >查询</el-button>
        <el-button
          type="primary"
          @click="onRest"
        >重置</el-button>
      </el-form-item>
      <el-button
        type="primary"
        class="absolute inline-block right-2"
        @click="dialogType = 1;formData = {};"
      >新增</el-button>
    </el-form>
  </div>
  <div class="flex-grow overflow-hidden rounded page-content">
    <common-table
      ref="table"
      :tableColumns="tableColumns"
      :url="appCtx.makeUrl('task/list')"
      reqMethods="POST"
      :config="tableConfig"
      :query="querySearch"
    >
      <template v-slot:report="{ row }">
        <el-button
          type="text"
          @click="onPreview(row)"
        >
          {{ taskIsFinish(row) ? '预览' : '-' }}</el-button>
      </template>
      <template #operate="{ row }">
        <el-button
          type="text"
          @click="onEdit(row)"
        >编辑任务</el-button>
        <el-button
          type="text"
          v-show="taskIsFinish(row)"
          @click="onSync(row)"
        >数据同步</el-button>
        <el-button
          type="text"
          @click="onContinue(row)"
        >{{ taskIsFinish(row) ? '编辑识别' : '继续识别' }}</el-button>

        <el-button
          type="text"
          @click="onDelete(row)"
        >删除</el-button>
      </template>
    </common-table>
  </div>
  <el-dialog
    v-if="formData"
    :title="dialogTitle"
    @close="formData = null"
    :visible="true"
    width="30%"
  >
    <el-form
      :model="formData"
      ref="addForm"
      label-width="110px"
      :rules="rules"
    >
      <el-form-item
        label="任务名称："
        prop="taskName"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.taskName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="任务描述："
        prop="taskDescription"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          placeholder="请输入"
          v-model="formData.taskDescription"
        ></el-input>
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          type="primary"
          @click="onSubmit"
        >确定</el-button>
        <el-button @click="formData = null">取消</el-button>
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
</main>
</template>

<script>
  import * as Helper from './Helper';
  import pdf from 'vue-pdf';
  export default {
    components: { pdf },
    inject: ['appCtx'],
    data () {
      return {
        searchForm: {
          status: void 0,
          keyWords: '',
          time: ['',''],
        },
        tableColumns: [
          {
            label: '任务名称',
            prop: 'taskName',
          },
          {
            label: '创建时间',
            prop: 'updateTime',
          },
          {
            label: '识别状态',
            prop: 'nodeName',
            width: 90,
          },
          {
            label: '管线数量',
            prop: 'pipeLineTotal',
            width: 80,
          },
          {
            label: '包含管道',
            prop: 'includePipeLine',
          },
          {
            label: '识别成果',
            prop: 'recognitionResults',
          },
          {
            label: '报告',
            prop: 'report',
            width: 70,
          },
          {
            label: '任务描述',
            prop: 'taskDescription',
          },
          {
            label: '操作',
            prop: 'operate',
            width: 270,
          },
        ],
        tableConfig: {
          border: true,
        },
        dialogType: 1,
        rules: {
          taskName: [{ required: true,message: '请输入' }],
          taskDescription: [{ required: true,message: '请输入' }],
        },
        formData: null,
        pdfPages: 0,
        pdf: null,
        statusOptions: [
          {
            value: 1,
            label: '分段',
          },
          {
            value: 2,
            label: '地区等级划分',
          },
          {
            value: 3,
            label: '高后果区识别',
          },
          {
            value: 4,
            label: '已完成',
          },
        ],
      };
    },
    computed: {
      querySearch: {
        get () {
          function convertNull (res) {
            for (const key in res) {
              if (Object.hasOwnProperty.call(res,key)) {
                const element = res[key];
                res[key] = element === '' ? null : element;
              }
            }
            return res;
          }
          const res = {
            ...this.searchForm,
            startTime: this.searchForm.time[0],
            endTime: this.searchForm.time[1],
            taskId: '',
          };
          delete res.time;
          return convertNull(res);
        },
      },
      dialogTitle () {
        if (this.dialogType === 1) {
          return '新增任务'
        }
        return this.dialogType === 2
          ? '编辑任务'
          : '其它';
      },
      taskIsFinish () {
        return (task) => task.status === 1;
      },
    },

    methods: {
      /**
       * @description 成果预览
       */
      onPreview (row) {
        console.log('row',row)
        const pdfPath = row.pdfPath;
        if (!pdfPath) {
          return this.$message.error('预览路径为空')
        }
        this.loadPdf(pdfPath)
      },
      /**
       * @description 删除任务
       */
      onDelete ({ id }) {
        Helper.remove(id).then(
          (_) => {
            this.$refs.table.refresh();
            this.$message.success('删除成功');
          },
          (_) => {
            this.$message.error('删除失败');
          }
        );
      },
      /**
       * @description 新增、编辑任务
       */
      onSubmit () {
        this.$refs.addForm.validate().then((res) => {
          Helper.addOrUpdateTask(this.formData).then((res) => {
            this.$router.push({
              path: '/DiscernSteps/choose',
              query: res,
            });
          });
        });
      },
      /**
       * @description 同步数据
       */
      onSync (row) {
        Helper.syncData(row).then(
          (_) => {
            this.$message.success('同步成功');
          },
          (_) => {
            this.$message.error('同步失败');
          }
        );
      },
      /**
       * @description 继续识别，跳转到识别阶段
       */
      onContinue (row) {
        const step = row.node;
        let path;
        switch (step) {
          case 0: {
            path = '/DiscernSteps/choose';
            break;
          }
          case 1: {
            path = '/DiscernSteps/section';
            break;
          }
          case 2: {
            path = '/DiscernSteps/level';
            break;
          }
          case 3: {
            path = '/DiscernSteps/discern';
            break;
          }
          case 4: {
            path = '/DiscernSteps/discern';
            break;
          }
        }
        this.$router.push({
          path: path,
          query: {
            id: row.id,
            taskName: row.taskName,
          },
        });
      },
      /**
       * @description 编辑已识别完成的任务，跳转到选择管线页面
       */
      onEdit (row) {
        this.dialogType = 2;
        this.formData = row;
      },
      onRest () {
        this.searchForm = {
          status: void 0,
          keyWords: '',
          time: ['',''],
        };
        setTimeout(this.$refs.table.refresh);
      },
      loadPdf (src) {
        this.pdf = pdf.createLoadingTask(src);
        this.pdf.promise.then((pdf) => {
          this.pdfPages = pdf.numPages;
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;

  .search-bar {
    padding: 8px;
    background-color: #fff;

    .el-form-item {
      margin-bottom: 0;

      .el-input {
        width: 200px;
      }
    }
  }

  .page-content {
    height: calc(100% - 66px);
    // background-color: #fff;
  }
}

::v-deep.gislife-table-container>.gislife-table__content {
  border-radius: 4px;
}

::v-deep.gislife-table-container>.gislife-table__footer {
  border-radius: 4px;
}
</style>
