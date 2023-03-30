<template>
  <div class="DataGovernance mainbox">
    <div class="box-title">数据治理情况</div>
    <div class="box-centent">
      <div class="top">
        <div>
          <div class="data">
            <el-image
              :src="require('@/assets/images/example/zckjsj.png')"
              fit="cover"
            ></el-image>
            <div>
              <p>站场空间数据</p>
              <p><span>226</span>座</p>
            </div>
          </div>
          <div class="jdt">
            <el-progress
              :stroke-width="16"
              :percentage="6.4"
              color="#4975fc"
              :show-text="false"
            ></el-progress>
          </div>
          <div>已完成：6.40%</div>
        </div>
        <div>
          <div class="data">
            <el-image
              :src="require('@/assets/images/example/zckjsj.png')"
              fit="cover"
            ></el-image>
            <div>
              <p>站场完整性</p>
              <p><span>226</span>座</p>
            </div>
          </div>
          <div class="jdt">
            <el-progress
              :show-text="false"
              :stroke-width="16"
              :percentage="40.92"
              color="#4975fc"
            ></el-progress>
          </div>
          <div>已完成：40.92%</div>
        </div>
      </div>

      <div class="bottom">
        <div>
          <div class="data">
            <el-image
              :src="require('@/assets/images/example/gdkjsj.png')"
              fit="cover"
            ></el-image>
            <div>
              <p>管道空间数据</p>
              <p><span>4652.38</span>km</p>
            </div>
          </div>
          <div class="jdt">
            <el-progress
              :show-text="false"
              :stroke-width="16"
              :percentage="6.4"
              color="#36c3ff"
            ></el-progress>
          </div>
          <div>已完成：6.40%</div>
        </div>
        <div>
          <div class="data">
            <el-image
              :src="require('@/assets/images/example/gdkjsj.png')"
              fit="cover"
            ></el-image>
            <div>
              <p>管道完整性</p>
              <p><span>4652.38</span>km</p>
            </div>
          </div>
          <div class="jdt">
            <el-progress
              :show-text="false"
              :stroke-width="16"
              :percentage="40.92"
              color="#36c3ff"
            ></el-progress>
          </div>
          <div>已完成：40%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataGovernance",
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";
.DataGovernance {
  .box-centent {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    > div {
      width: 100%;
      height: 48%;
      display: flex;
      justify-content: space-between;
      > div {
        width: 48%;
        box-shadow: 0px 0px 5px rgb(167, 166, 166);
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .data {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
            height: 40px;
          }
        }
      }
    }
  }
}
</style>
