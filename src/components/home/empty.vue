<template>
<div class="content-inner empty-page">
  <img
    :src="require('@/assets/images/page-empty.png')"
    alt=""
  >
  <div>
    <p>首页暂未配置，请前往配置中心</p>
    <Auth funCode="sypz">
      <el-button type="primary">首页配置</el-button>
    </Auth>
  </div>
</div>
</template>



<style lang="scss" scoped>
  .empty-page {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #E6EEF7;
    text-align: center;

    img {
      height: 600px;
    }

    p {
      margin: 10px 0;
      font-size: 24px;
      font-weight: 700;
    }
}
</style>
