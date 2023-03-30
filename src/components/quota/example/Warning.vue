<template>
  <div class="Warning mainbox">
    <div class="box-title">检测评价预警</div>
    <div class="box-centent">
      <div class="top">
        <div>
          <el-image
            :src="require('@/assets/images/example/zcjc.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>站场检测评价</p>
            <p><span>106</span>座</p>
          </div>
        </div>
        <div>
          <el-image
            :src="require('@/assets/images/example/zcfx.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>站场风险评价</p>
            <p><span>111</span>座</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div>
          <el-image
            :src="require('@/assets/images/example/gdn.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>管道内检测</p>
            <p><span>2136.231</span>km</p>
          </div>
        </div>
        <div>
          <el-image
            :src="require('@/assets/images/example/gdw.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>管道外检测</p>
            <p><span>2211.235</span>km</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Warning",
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";
.Warning {
  .box-centent {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    > div {
      width: 100%;
      height: 48%;
      display: flex;
      justify-content: space-between;
      > div {
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        p {
          color: #fff;
          font-size: 16px;
          text-align: center;
          span {
            font-size: 22px;
            margin-right: 4px;
          }
        }
      }
    }
    .top {
      > div {
        width: 48%;
        height: 100%;
        background-color: rgb(73, 117, 252);
      }
    }
    .bottom {
      margin-top: 4%;
      > div {
        width: 48%;
        height: 100%;
        background-color: rgb(54, 195, 255);
      }
    }
    .el-image {
      height: 60px;
    }
  }
}
</style>
