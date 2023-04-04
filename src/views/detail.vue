<template>
  <main>
    <div class="page-top shadow-content  bg-fff px-2 py-1">
      <div class="font16 inline_div l-h-24rem fw_600">详情</div>
      <el-button class="f-r" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="page-content m-t-10 bg-fff shadow-content">
      <section>
        <div class="content-title">基础信息</div>
        <el-descriptions border :column="3">
          <el-descriptions-item label="管道名称">22222222222222</el-descriptions-item>
          <el-descriptions-item label="管段名称"></el-descriptions-item>
          <el-descriptions-item label="二级单位"></el-descriptions-item>
          <el-descriptions-item label="三级单位"></el-descriptions-item>
          <el-descriptions-item label="起点"></el-descriptions-item>
          <el-descriptions-item label="终点"></el-descriptions-item>
          <el-descriptions-item label="长度（km）"></el-descriptions-item>
          <el-descriptions-item label="管径（mm）"></el-descriptions-item>
          <el-descriptions-item label="壁厚（mm）"></el-descriptions-item>
          <el-descriptions-item label="刚级"></el-descriptions-item>
          <el-descriptions-item label="制管方式"></el-descriptions-item>
          <el-descriptions-item label="防腐材料"></el-descriptions-item>
          <el-descriptions-item label="投运日期"></el-descriptions-item>
          <el-descriptions-item label="设计压力（MPa）"></el-descriptions-item>
          <el-descriptions-item label="运行压力（MPa）"></el-descriptions-item>
          <el-descriptions-item label="设计输量（10 m³/d）"></el-descriptions-item>
          <el-descriptions-item label="运行输量（10 m³/d）"></el-descriptions-item>
          <el-descriptions-item label="运行状态"></el-descriptions-item>
          <el-descriptions-item label="四川境内长度（km）"></el-descriptions-item>
          <el-descriptions-item label="重庆境内长度（km）"></el-descriptions-item>
          <el-descriptions-item label="途径市、州"></el-descriptions-item>
          <el-descriptions-item label="备注"></el-descriptions-item>
        </el-descriptions>
      </section>
      <section>
        <div class="content-title">潜在影响范围</div>
        <el-descriptions border :column="3">
          <el-descriptions-item label="影响半径"></el-descriptions-item>
          <el-descriptions-item label="暴露半径"></el-descriptions-item>
          <el-descriptions-item label=""></el-descriptions-item>
        </el-descriptions>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;

  .page-content {
    height: calc(100% - 48px);
    width: 100%;

    ::v-deep .el-descriptions {
      .el-descriptions-item__label {
        background: #EDF4FB;
        text-align: center;
        color: #333;
        font-weight: 600;
      }

      .el-descriptions-item__cell {
        border-color: #8CC6FB;
      }
    }

  }
}
</style>