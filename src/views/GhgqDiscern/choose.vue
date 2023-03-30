<template>
  <div class="choose-wrapper">
    <div class="choose-content">
      <div>
        <div class="choose-title">作业区所有管线列表</div>
        <div class="choose-search m-t-10 m-b-10 ">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="管线名称：">
              <el-input placeholder="请输入管线名称"></el-input>
            </el-form-item>
            <el-button class="f-r m-r-10" type="success">全选</el-button>
          </el-form>
        </div>
        <div class="choose-table">
          <div class="choose-table-wrapper">
            <el-table height="100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" width="55" label="序号"></el-table-column>
              <el-table-column label="管线"></el-table-column>
              <el-table-column label="类型"></el-table-column>
              <el-table-column label="规格"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div>
        <div class="choose-title">已选择管线列表</div>
        <div class="choose-search m-t-10 m-b-10 ">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="管线名称：">
              <el-input placeholder="请输入管线名称"></el-input>
            </el-form-item>
            <el-button class="f-r m-r-10" type="primary">清空</el-button>
          </el-form>
        </div>
        <div class="choose-table">
          <div class="choose-table-wrapper">
            <el-table height="100%">
              <el-table-column type="index" width="55" label="序号"></el-table-column>
              <el-table-column label="管线"></el-table-column>
              <el-table-column label="类型"></el-table-column>
              <el-table-column label="规格"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="choose-footer m-t-10 shadow-content">
      <div>
        <el-button type="primary" @click="handleBack">退出</el-button>
        <el-button type="primary" @click="handleDiscern">一键识别</el-button>
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    handleNext() {
      this.$router.push({
        path: '/DiscernSteps/section'
      })
    },
    handleDiscern() { }
  },
}
</script>

<style lang="scss" scoped>
.choose-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .choose-content {
    flex: 1;
    display: flex;
    justify-content: space-between;

    >div {
      background-color: #fff;
      height: 100%;
      width: calc(50% - 5px);
      display: flex;
      flex-direction: column;

      .choose-title {
        color: #333;
        font-weight: 600;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        text-indent: 16px;
        border-bottom: 1px solid #bbb;
      }

      .choose-table {
        flex: 1;
        position: relative;

        .choose-table-wrapper {
          position: absolute;
          height: 100%;
          width: 100%;

          .el-table {
            margin: 0;
          }
        }
      }
    }
  }

  .choose-footer {
    height: 70px;
    background-color: #fff;
    text-align: center;
    display: flex;
    align-items: center;

    >div {
      margin: 0 auto;
    }
  }
}
</style>