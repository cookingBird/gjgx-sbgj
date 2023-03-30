<template>
  <div class="glzngdhz deep-mainbox">
    <div class="deep-box-title">管理职能管道汇总</div>
    <div class="box-content" v-loading="loading">
      <div class="box">
        <div>
          <img class="img1" :src="require('@/assets/images/u27.png')" alt="" />
          <img class="img2" :src="require('@/assets/images/u15.png')" alt="" />
          <span class="text3"> 管道部</span>
        </div>
        <div>
          <div class="top">管道数量</div>
          <div class="bottom">
            <span style="color: yellow; font-size: 20px; margin-right: 5px"
              >50</span
            >
            <span>条</span>
          </div>
        </div>
        <div>
          <div class="top">管道总长</div>
          <div class="bottom">
            <span style="color: yellow; font-size: 20px; margin-right: 5px"
              >50</span
            >
            <span>km</span>
          </div>
        </div>
      </div>
      <div class="box">
        <div>
          <img class="img1" :src="require('@/assets/images/u28.png')" alt="" />
          <img class="img2" :src="require('@/assets/images/u15.png')" alt="" />
          <span class="text3"> 开发部</span>
        </div>
        <div>
          <div class="top">管道数量</div>
          <div class="bottom">
            <span style="color: yellow; font-size: 20px; margin-right: 5px"
              >50</span
            >
            <span>条</span>
          </div>
        </div>
        <div>
          <div class="top">管道总长</div>
          <div class="bottom">
            <span style="color: yellow; font-size: 20px; margin-right: 5px"
              >50</span
            >
            <span>km</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "glzngdhz",


};
</script>

<style lang="scss" scoped>
.glzngdhz {
  position: relative;
  .box {
    height: 50%;

    display: flex;
    div {
      width: 33.3%;
      font-size: 16px;
      color: #fff;
    }
    div:nth-of-type(1) {
      position: relative;
      .img1 {
        position: absolute;
        bottom: 0px;
        width: 30%;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
      }
      .img2 {
        position: absolute;
        bottom: 10px;
        width: 80%;
        left: 50%;
        transform: translateX(-50%);
      }
      .text3 {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    div:nth-of-type(2),
    div:nth-of-type(3) {
      flex-direction: column;
      .top {
        width: 100%;
        height: 50%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }
      .bottom {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 50%;
      }
    }
  }
}
</style>
