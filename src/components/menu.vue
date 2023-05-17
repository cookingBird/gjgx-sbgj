<script>

import { mapGetters } from 'vuex';

export default {
  render: function (h) {
    let menuFun = (data, lastIx) => {
      return (
        Array.isArray(data) &&
        data.map((item, index) => {
          // 特殊定义字段，隐藏不想展示的页面
          if (item.note === 'UNSHOW' || item.funType === 1 || item.hasDisplay === 0) return;
          // 判断是否含有子菜单 
          //  过滤按钮类型
          let childData = item.children.filter(c => c.funType != 1);
          if (childData?.length) {
            return (
              <el-submenu key={item.funCode} index={lastIx + '-' + index}>
                <div slot='title'>
                  <i class={item.icon}></i>
                  <span>{item.funName}</span>
                </div>
                <el-menu-item-group>{menuFun(childData, lastIx + '-' + index)}</el-menu-item-group>
              </el-submenu>
            );
          } else {
            return (
              <el-menu-item key={item.funName} index={item.route || lastIx + '-' + index}>
                <i class={item.icon}></i>
                <span slot='title'>{item.funName}</span>
              </el-menu-item>
            );
          }
        })
      );
    };
    let menuDataDom = menuFun(this.subnavMenu, 1);
    return (
      <div class={['shadow-content', 'menu-container', this.isCollapse ? 'collapse' : '']}>
        <div
          class='collapse-bar'
          onClick={() => {
            this.isCollapse = !this.isCollapse;
          }}>
          <i class={[!this.isCollapse ? 'el-icon-s-fold' : '', this.isCollapse ? 'el-icon-s-unfold' : '']}></i>
          <span v-show={!this.isCollapse}>工作台</span>
        </div>
        <el-menu default-active={this.defaultActive} collapse={this.isCollapse} router={true}>
          {menuDataDom}
        </el-menu>
      </div>
    );
  },
  name: 'Menu',
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    ...mapGetters({
      subnavMenu: 'auth/subnavMenu'
    }),
    defaultActive() {
      return this.$route.path;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.menu-container {
  height: 100%;
  width: 256px;

  .collapse-bar {
    width: 100%;
    height: 50px;
    padding: 7px 0;
    text-align: center;
    color: #063770;
    background-color: #eef2f6;

    i {
      font-size: 36px;
      cursor: pointer;
      vertical-align: bottom;
    }

    span {
      font-size: 20px;
      margin-left: 4px;
      display: inline-block;
      line-height: 1.8;
    }
  }

  ::v-deep .el-menu {
    height: calc(100% - 50px);
    background-color: #ffffff;

    .el-menu-item {
      &.is-active {
        color: #ffffff;
        background-color: #063770;
      }
    }
  }
}

.menu-container.collapse {
  width: auto;

  .collapse-bar {
    width: 63px;
  }
}
</style>
