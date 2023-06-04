<template>
<main class="flex flex-col space-y-2">
  <folder-block class="flex-grow-0 flex-shrink-0">
    <template v-slot:default={show}>
      <div
        v-show="show"
        class="rounded step-wrapper shadow-content"
      >
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
    </template>
  </folder-block>
  <div class="flex-grow overflow-hidden rounded page-content">
    <router-view ref="view"></router-view>
  </div>
</main>
</template>

<script>
  import { taskDetail } from './Helper';
  const ACTIVE_MAP = {
    '/DiscernSteps/choose': 1,
    '/DiscernSteps/section': 2,
    '/DiscernSteps/level': 3,
    '/DiscernSteps/discern': 4,
  }
  export default {
    data() {
      return {

      }
    },
    computed: {
      stepActive() {
        return ACTIVE_MAP[this.$route.path] - 1;
      },
      isFromOuter() {
        return Boolean(this.$route.query.message) || Boolean(this.$route.query.backHref);
      },
    },
    mounted() {
      const steps = document.querySelectorAll('.el-steps .el-step__icon-inner');
      for (const stepIcon of steps) {
        stepIcon.style.cursor = 'pointer';
        stepIcon.addEventListener('click', this.handleNodeClick)
      };
      console.log('step bar this.$route---------------', this.$route);
    },
    methods: {
      handleNodeClick(e) {
        const step = e.target.innerText;
        taskDetail(this.$route.query.taskId).then(({ node }) => {
          //一键识别会将node设为3
          if ((step - 1) > node) {
            // if ((step) > node) {
            this.$message.error('当前任务未完成，请按步骤完成当前任务')
          } else {
            if (this.isFromOuter) {
              if (step == 1) {
                if (this.$route.query.backHref) {
                  location.href = this.$route.query.backHref;
                } else {
                  //deprecated
                  this.$connector.$send(this.$route.query.message);
                }
              } else {
                this.$router.push({
                  path: Object.entries(ACTIVE_MAP).find(([path, node]) => node == step)[0],
                  query: this.$route.query
                })
              }
            } else {
              this.$router.push({
                path: Object.entries(ACTIVE_MAP).find(([path, node]) => node == step)[0],
                query: this.$route.query
              })
            }
          }
        })
        console.log('handleNodeClick step', step);
      }
    }
  }
</script>

<style lang="scss" scoped>
  main {
    width: 100%;
    height: 100%;
  }

  ::v-deep .step-wrapper {
    padding: 9px 0px 2px 0px;

    .el-step__icon {
      width: 30px;
      height: 30px;
      border-color: #949494;

      .el-step__icon-inner {
        color: #949494;
      }
    }

    .el-step__title {
      font-weight: normal;
      color: #333;
    }

    .el-step__line {
      color: transparent;
      border-color: transparent;
    }

    .is-process {
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
