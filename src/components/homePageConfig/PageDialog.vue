<template>
  <el-dialog width="400px" :visible.sync="visible" title="新增页面" :close-on-click-modal="false" @close="handleClose">
    <div class="page-dialog-content">
      <el-form ref="formRef" :model="formData" :rules="formRule" label-width="80px">
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入页面名称"></el-input>
        </el-form-item>
        <el-form-item label="页面类型" prop="classFlag">
          <el-select v-model="formData.classFlag" disabled>
            <el-option label="公共" :value="0"></el-option>
            <el-option label="个人" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formData.classFlag === 0" label="页面权限" prop="org">
          <el-button @click="openAuth">设置</el-button>
        </el-form-item>
        <el-form-item label="页面描述" prop="depict">
          <el-input type="textarea" v-model="formData.depict" :rows="4" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item prop="id"></el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
    <auth-dialog ref="auth" @confirm="handleAuthConfirm"></auth-dialog>
  </el-dialog>
</template>

<script>
import AuthDialog from './AuthDialog.vue';
import { addAllocation } from '@/api/index';

export default {
  components: {
    AuthDialog
  },
  name: 'page-dialog',
  data() {
    return {
      visible: false,
      formData: {
        name: '',
        classFlag: 0,
        status: 0,
        org: [],
        depict: '',
        id: ''
      },
    }
  },
  computed: {
    formRule() {
      let rule = {
        name: [{
          required: true,
          message: "请输入页面名称",
          trigger: 'change'
        }],
        classFlag: [{
          required: true,
          message: "请选择页面类型",
          trigger: 'change'
        }],
        status: [{
          required: true,
          message: "请选择页面状态",
          trigger: 'change'
        }],
      }
      if (this.formData.classFlag === 0) {
        rule.org = [{
          type: 'array',
          required: true,
          message: '请选择页面权限'
        }]
      }
      return rule;
    }
  },
  methods: {
    openAuth() {
      this.$refs['auth'].open(this.formData.org);
    },
    open(param) {
      this.visible = true;
      this.$nextTick(() => {
        if (Object.prototype.toString.call(param) === '[object Object]') {
          this.formData = _.cloneDeep(param);
        } else {
          this.formData.classFlag = param;
        }
      })

    },
    handleAuthConfirm(result) {
      this.formData.org = result;
    },
    handleClose() {
      this.$refs['formRef'].resetFields();
    },
    handleConfirm() {
      this.$refs['formRef'].validate(async (valid) => {
        if (valid) {
          const { code, data } = await addAllocation(this.formData);
          if (code === 200) {
            this.$message.success(data);
            this.visible = false;
            this.$emit('confirm');
          }
        }
      })
    }
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

.page-dialog-content {
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>