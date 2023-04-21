<template>
  <div class="history-bar shadow-content">
    <el-tabs v-model="active" type="card" :closable="list.length > 1" @edit="handleTabsEdit" @tab-click="handleTabClick">
      <el-tab-pane :key="item.name" v-for="item in list" :label="item.meta.name" :name="item.path">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
export default {
  data() {
    return {
      active: "",
    };
  },
  watch: {
    "$route.path": {
      handler: function (val) {
        this.active = val;
        this.listAdd(this.$route);
      },
      immediate: true,
    },
  },
  computed: {
    list() {
      return this.$store.state.history.list;
    }
  },
  methods: {
    listAdd(route) {
      this.$store.commit('history/HISTORY_ADD', route);
    },
    handleTabClick({ name: path }) {
      this.$router.push({
        path,
      });
    },
    handleTabsEdit(name) {
      this.$store.commit('history/HISTORY_DEL', name);
      if (this.$route.path === name) {
        this.$router.push({
          path: this.list[this.list.length - 1].path,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.history-bar {
  height: 40px;
  background-color: #fff;

  /deep/.el-tabs {
    .el-tabs__header {
      position: relative;
      top: -1px;
    }

    .el-tabs__item.is-active {
      border: 0;
      background-color: #05366f;
      color: #fff !important;
    }

    .el-tabs__item:hover {
      color: #000;
    }

    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      width: 40px;
      text-align: center;
      font-size: 26px;
    }

    .el-tabs__nav-wrap.is-scrollable {
      padding: 0 40px;
    }
  }
}
</style>
