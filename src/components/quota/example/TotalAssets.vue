<template>
  <div class="TotalAssets mainbox">
    <div class="box-title">总体资产</div>
    <div class="box-centent">
      <div class="top">
        <div>
          <el-image
            :src="require('@/assets/images/example/zc.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>站场</p>
            <p><span>3532</span>座</p>
          </div>
        </div>
        <div @click="handlePipeClick">
          <el-image
            :src="require('@/assets/images/example/gd.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>管道</p>
            <p><span>11369</span>km</p>
          </div>
        </div>
      </div>
      <div class="center">
        <div>
          <el-image
            :src="require('@/assets/images/example/fs.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>阀室</p>
            <p><span>64</span>座</p>
          </div>
        </div>
        <div>
          <el-image
            :src="require('@/assets/images/example/jhc.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>净化厂</p>
            <p><span>20</span>座</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div>
          <el-image
            :src="require('@/assets/images/example/j.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>井</p>
            <p><span>6314</span>口</p>
          </div>
        </div>
        <div>
          <el-image
            :src="require('@/assets/images/example/dmgc.png')"
            fit="cover"
          ></el-image>
          <div>
            <p>地面工程</p>
            <p><span>40</span>项</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TotalAssets",
  methods: {
    handlePipeClick() {
      this.$emit('fullscreenChange', false);

      this.$emit('callMap', {
        excutor: () => {
          this.$refs['table'].open({
            id: '1598159146187948033',
            tableName: 'GE_PIPE_SEGMENT_PL',
            requestParams: {
              optional: [],
              tableType: 2
            },
            checkDetail(row, cb) {
              cb();
            },
          })
        },
        param: {
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";

.TotalAssets {
  .box-centent {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    flex: 1;

    > div {
      width: 100%;
      height: 30%;
      display: flex;
      justify-content: space-between;

      > div {
        width: 48%;
        box-shadow: 0px 0px 5px rgb(167, 166, 166);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        padding: 8px 12px;
      }

      p {
        color: #333;
        font-size: 16px;
        text-align: center;

        span {
          font-size: 22px;
          margin-right: 4px;
          font-weight: 700;
        }
      }

      .el-image {
        height: 50px;
        background-color: #4975fc;
        border-radius: 50%;
        padding: 10px;
      }
    }

    .bottom {
      .el-image {
        background-color: #36c3ff;
      }
    }
  }
}
</style>
