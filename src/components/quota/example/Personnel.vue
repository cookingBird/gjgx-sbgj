<template>
  <div class="Personnel mainbox">
    <div class="box-title">人员信息</div>
    <div class="box-centent">
      <div class="left">
        <el-image
          :src="require('@/assets/images/example/usersvg.svg')"
          fit="cover"
        ></el-image>
        <div class="name">{{ userInfo.userName }}</div>
        <div class="position">{{ userInfo.orgName }}</div>
      </div>
      <div class="right">
        <div class="top">
          <div>
            <p>待办任务</p>
            <p><span>20</span>项</p>
          </div>
          <el-image
            :src="require('@/assets/images/example/rw.png')"
            fit="cover"
          ></el-image>
        </div>
        <div class="bottom">
          <div>
            <p>消息通知</p>
            <p><span>20</span>条</p>
          </div>
          <el-image
            :src="require('@/assets/images/example/rw.png')"
            fit="cover"
          ></el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Personnel",
  computed: {
    userInfo() {
      return this.$store.state.auth.userinfo;
    },
  },
  mounted() {
    console.log(this.userInfo);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";
.Personnel {
  .box-centent {
    height: calc(100% - 70px);
    display: flex;
    .left {
      width: 46%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 5px rgb(127, 127, 127);
      .el-image {
        border-radius: 50%;
        padding: 19.5px 23px;
        background-color: rgb(6, 55, 112);
      }
      > div {
        font-size: 16px;
        margin-top: 10px;
      }
    }
    .right {
      width: 50%;
      margin-left: 4%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        background-color: #4975fc;
      }
      .bottom {
        background-color: #36c3ff;
      }
      .top,
      .bottom {
        width: 100%;
        height: 90px;
        border-radius: 20px;
        padding: 12px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 16px;
          span {
            font-size: 22px;
            margin-right: 4px;
          }
        }
      }
      .el-image {
        height: 60px;
      }
    }
  }
}
</style>
