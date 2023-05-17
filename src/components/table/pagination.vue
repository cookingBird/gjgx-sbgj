<template>
  <el-pagination
    :background="configCom.background"
    :small="configCom.small"
    :total="total"
    :page-size.sync="pageParams.pageSize"
    :pager-count="configCom.pagerCount"
    :current-page.sync="pageParams.pageNo"
    :page-sizes="configCom.pageSizes"
    :prev-text="configCom.prevText"
    :next-text="configCom.nextText"
    :layout="configCom.layout"
    v-on="$listeners"
  >
  </el-pagination>
</template>

<script>
  export default {
    name: 'pagination',
    inheritAttrs: false,
    props: {
      pageParams: {
        type: Object,
        default: () => {
          return {};
        }
      },
      total: {
        type: Number,
        default: 0
      },
      pagerConfig: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    computed: {
      configCom () {
        const pagerConfig = this.pagerConfig ?? {};
        return {
          background: pagerConfig.background ?? true,
          layout: pagerConfig.layout ?? 'total, sizes, prev, pager, next, jumper',
          pageSizes: pagerConfig.pageSizes ?? [10,30,60,80,100],
          pagerCount: pagerConfig.pagerCount || 7,
          ...pagerConfig
        };
      }
    },
  };
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;

  ::v-deep .el-pagination {
    .el-pagination__total,
    .el-input__inner,
    .el-pagination__jump {
      font-size: 16px;
    }
  }

  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: $--cas-color1;
  }
}
</style>
