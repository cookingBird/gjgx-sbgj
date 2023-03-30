<template>
  <el-dialog :title="formData.id ? '编辑组件' : '新增组件'" :visible.sync="dialogVisible" width="30%" custom-class="zjtk"
    top="6vh" :close-on-click-modal="false" @close="resetForm('ruleForm')" center>
    <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="组件类别" prop="type">
        <el-select v-model="formData.type" placeholder="请选择组件类别">
          <el-option :value="item.value" v-for="item in zjlb" :key="item.value" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入组件名称"></el-input>
      </el-form-item>
      <el-form-item label="组件编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入组件编码"></el-input>
      </el-form-item>
      <el-form-item label="组件标签" prop="tagId">
        <el-select v-model="tags" multiple collapse-tags placeholder="请选择组件标签" @change="handleTagSelectChange">
          <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.type === 2" label="组件地址" prop="route">
        <el-input v-model="formData.route" placeholder="请输入组件地址"></el-input>
      </el-form-item>
      <el-form-item label="预览图片" prop="image">
        <el-upload action="" class="avatar-uploader" :show-file-list="false" :auto-upload="false"
          :on-change="uploadImgChange" accept=".jpg,.jpeg,.png">
          <img v-if="formData.image" :src="formData.image" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="纵向尺寸" prop="xcoordinate">
        <el-select v-model="formData.xcoordinate">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="横向尺寸" prop="ycoordinate">
        <el-select v-model="formData.ycoordinate">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件私密性" prop="secretFlag">
        <el-select v-model="formData.secretFlag" placeholder="请选择组件私密性">
          <el-option :value="item.value" v-for="item in zjsmx" :key="item.value" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.secretFlag === 2" label="权限设置">
        <el-button type="primary" size="small" @click="openAuth">设置</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="bged" @click="submitForm('ruleForm')">注册</el-button>
      <el-button class="bgdel" @click="resetForm('ruleForm')">取消</el-button>
    </span>

    <auth-dialog ref="auth" @confirm="handleAuthConfirm"></auth-dialog>
  </el-dialog>
</template>
<script>
import { fileToBase64 } from "@/utils/tool";
import {
  componentAdd,
  componentUpdate,
} from "@/api/index";
import { getTagOptionApi } from "@/api/tag";
import AuthDialog from '../homePageConfig/AuthDialog.vue';
import _ from "lodash";

export default {
  components: {
    AuthDialog
  },
  data() {
    return {
      dialogVisible: false,
      zjlb: [
        { name: "系统组件", value: 1 },
        { name: "第三方组件", value: 2 },
      ],
      zjsmx: [
        { name: "全部公开", value: 1 },
        { name: "部分公开", value: 2 },
        { name: "仅我可见", value: 3 },
      ],
      tags: [],
      tagOptions: [],
      formData: {
        code: "",
        image: "",
        name: "",
        route: "",
        secretFlag: 1,
        type: 1,
        xcoordinate: 1,
        ycoordinate: 1,
        org: [],
        tagId: "",
      },
    };
  },
  computed: {
    rules() {
      let rule = {
        type: [
          { required: true, message: "请选择组件类别", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入组件名称", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入组件编码", trigger: "change" },
        ],
        img: [{ required: true, message: "请选择预览图片", trigger: "change" }],
        zxnum: [{ required: true, message: "请输入纵向尺寸", trigger: "blur" }],
        hxnum: [{ required: true, message: "请输入横向尺寸", trigger: "blur" }],
        secretFlag: [
          { required: true, message: "请选择组件私密性", trigger: "change" },
        ],
      };
      if (this.formData.type === 2) {
        rule.route = [
          { required: true, message: "请输入组件地址", trigger: "change" },
        ];
      }
      if (this.formData.secretFlag === 2) {
        rule.orgCode = [
          { required: true, message: "请选择所属组织机构", trigger: "change" },
        ];
      }
      return rule;
    },
  },
  created() {
    this.getTagOptions();
  },
  methods: {
    openAuth() {
      this.$refs['auth'].open(this.formData.org);
    },
    handleAuthConfirm(result) {
      this.formData.org = result;
    },
    async getTagOptions() {
      try {
        const { code, data } = await getTagOptionApi();
        if (code === 200) {
          this.tagOptions = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleTagSelectChange(val) {
      this.formData.tagId = val.join(",");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const api = this.formData.id ? componentUpdate : componentAdd;
          try {
            const { code } = await api(this.formData);
            if (code === 200) {
              this.$message.success(
                `${this.formData.id ? "修改" : "新增"}组件成功`
              );
              this.dialogVisible = false;
              this.$emit("onConfirm");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    open(formData) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (formData) {
          this.formData = _.cloneDeep(formData);
          this.tags =
            typeof this.formData.tagId === String
              ? this.formData.tagId.split(",")
              : [];
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.tags = [];
      this.dialogVisible = false;
    },
    uploadImgChange({ raw }) {
      fileToBase64(raw).then((base64) => {
        this.formData.image = base64;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.zjtk {
  border-radius: 4px;
  overflow: hidden;

  .demo-ruleForm {

    .el-select,
    .el-input-number,
    .el-cascader {
      width: 100%;

      .el-input__inner {
        text-align: left !important;
      }
    }

    .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &:hover {
          border-color: #409eff;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 200px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }

        .avatar {
          width: 200px;
          height: 120px;
          display: block;
        }
      }
    }
  }

  .el-dialog__header {
    background-color: #05366f;

    .el-dialog__title,
    .el-dialog__close {
      color: #fff;
    }
  }
}
</style>
