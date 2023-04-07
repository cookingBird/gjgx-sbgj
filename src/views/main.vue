<template>
  <div class="main-container">
    <CusHeader :title="systemName" />
    <div :class="{
      'page-content': true,
      homepageBgColor: $route.path == '/home' || $route.path == '/main/home',
    }">
      <router-view />
    </div>
  </div>
</template>

<script>
import CusHeader from "@/components/MyHeader.vue";

export default {
  components: {
    CusHeader,
  },
  data() {
    return {
      systemName: "共建共享指标配置系统",
    };
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;

  background-color: #e6eef7;
  display: flex;
  flex-direction: column;

  .page-content {
    flex: 1;
    width: 100%;
    height: calc(100% - 60px);
    padding: 10px;
  }
}
</style>
