<template>
  <main>
    <div class="main-left">
      <Menu />
    </div>
    <div class="main-right">
      <HistoryBar />
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script>
import Menu from "@/components/menu.vue";
import HistoryBar from "@/components/historyBar.vue";

export default {
  name: "Home",
  components: {
    Menu,
    HistoryBar,
  },
};
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;

  .main-left {
    height: 100%;
  }

  .main-right {
    margin-left: 10px;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .main-content {
      flex: 1;
      background-color: #fff;
      margin-top: 10px;
    }
  }
}
</style>
