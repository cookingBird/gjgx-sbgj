<template>
  <div class="page-header">
    <div class="header-left">
      <img
        class="logo"
        :src="require('@/assets/images/logo.png')"
        alt=""
      />
      <span class="app-title">{{ title }}</span>
    </div>
    <div class="header-right">
      <el-menu
        mode="horizontal"
        background-color="#0d2644"
        text-color="#fff"
        active-text-color="#fff"
        :default-active="menuActive"
        @select="handleMenuSelect"
      >
        <el-menu-item
          v-for="(item, index) in navs"
          :index="index.toString()"
          :key="item.id"
        >
          <span>{{ item.funName }}</span>
        </el-menu-item>
      </el-menu>
      <div class="user-bar">
        <div class="user">
          <i class="el-icon-user"></i>
          <span>{{ userName }}</span>
        </div>
        <div
          class="logout"
          @click="handleLogout"
        >
          <i class="el-icon-switch-button"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/base';
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    menuActive () {
      return this.navs
        .findIndex(item => {
          return this.$route.matched.some(({ path }) => path === item.route)
        })
        .toString();
    },
    homeRoute () {
      return this.navs.filter(item => item.funType === 2)[0].route;
    },
    userName () {
      return this.$store.state.auth.userName;
    },
    navs () {
      return this.$store.state.auth.menuData;
    },
    viewpageList () {
      return this.$store.state.auth.viewPageList;
    }
  },
  watch: {
    menuActive: {
      immediate: true,
      handler (val) {
        if (typeof val === 'string') {
          this.$store.commit('auth/SET_NAV_ACTIVE_CODE',this.navs[val]?.funCode);
        }
      }
    },
  },
  methods: {
    handleLogout () {
      this.$confirm('确认退出?','操作提示',{
        type: 'warning',
      }).then(async () => {
        try {
          const { code,data } = await logout();
          if (code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            location.reload();
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
    handleMenuSelect (key) {
      this.$router.push({
        path: this.navs[key].route,
        query: { token: sessionStorage.getItem('token') },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  height: 60px;
  background-color: #0d2644;
  display: flex;
  justify-content: space-between;
  padding: 0 38px 0 16px;
  color: #fff;

  >div {
    display: flex;
    align-items: center;

    .logo {
      width: 50px;
      height: 50px;
    }

    .app-title {
      font-size: 34px;
      margin-left: 16px;
    }

    .user-bar {
      display: flex;
      align-items: center;

      i {
        font-size: 26px;
      }

      .user {
        display: flex;
        align-items: center;
        margin-right: 26px;

        .el-icon-user {
          color: #fff;
        }

        span {
          font-size: 16px;
        }
      }

      .logout {
        cursor: pointer;
      }
    }
  }

  ::v-deep .el-menu {
    margin-right: 20px;

    .el-menu-item {
      font-size: 20px;
      border-bottom: 0;
      font-weight: 600;

      &.is-active {
        background-color: #0b79df !important;
      }

      .el-dropdown {
        >span {
          font-size: 20px;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
}
</style>
