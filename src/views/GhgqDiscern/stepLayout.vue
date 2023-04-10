<template>
<main class="flex flex-col">
  <div class="flex-grow-0 flex-shrink-0 rounded step-wrapper shadow-content">
    <el-steps
      :active="stepActive"
      align-center
    >
      <el-step
        title="管道选择"
        description
      ></el-step>
      <el-step
        title="管道分段"
        description
      ></el-step>
      <el-step
        title="地区等级划分"
        description
      ></el-step>
      <el-step
        title="高后果区识别"
        description
      ></el-step>
    </el-steps>
  </div>
  <div class="flex-grow overflow-hidden rounded page-content">
    <router-view></router-view>
  </div>
</main>
</template>

<script>
  const ACTIVE_MAP = {
    '/DiscernSteps/choose': 1,
    '/DiscernSteps/section': 2,
    '/DiscernSteps/level': 3,
    '/DiscernSteps/discern': 4,
  }
  export default {
    data () {
      return {

      }
    },
    computed: {
      stepActive () {
        return ACTIVE_MAP[this.$route.path] - 1;
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;

  .page-content {
    width: 100%;
  }
}

::v-deep .step-wrapper {
  padding: 9px 0px 2px 0px;

  .el-step__icon {
    width: 30px;
    height: 30px;
  }

  .el-step__title {
    font-weight: normal;
    color: #333;
  }

  .el-step__icon {
    border-color: #949494;

    .el-step__icon-inner {
      color: #949494;
    }
  }

  .is-process {
    color: #063770;
    border-color: #063770;

    .el-step__icon {
      border-color: #3B9CF6;
      background-color: #3B9CF6;

      .el-step__icon-inner {
        color: #fff;
      }
    }
  }

  .is-finish {
    .el-step__icon {
      border-color: #3B9CF6;
      background-color: #3B9CF6;

      .el-step__icon-inner {
        color: #fff;
      }
    }
  }
}
</style>
