<template>
  <div v-show="visible" class="pipe-info-wrapper" ref="default-pop">
    <div class="pipe-info-header">
      <span>管道详情</span>
      <i class="el-icon-close" @click="handleClose"></i>
    </div>
    <div class="pipe-info-content">
      <div>
        <label>管道名称：</label>
        <span>{{ info.pipeName }}</span>
      </div>
      <div>
        <label>管段名称：</label>
        <span>{{ info.pipeSegmentName }}</span>
      </div>
      <div>
        <label>二级单位：</label>
        <span>{{ info.secOrgName }}</span>
      </div>
      <div>
        <label>三级单位：</label>
        <span>{{ info.orgName }}</span>
      </div>
      <div>
        <label>起点：</label>
        <span>{{ info.startPosition }}</span>
      </div>
      <div>
        <label>终点：</label>
        <span>{{ info.endPosition }}</span>
      </div>
      <div>
        <label>长度(km)：</label>
        <span>{{ info.segmentLength }}</span>
      </div>
      <div>
        <label>管径(mm)：</label>
        <span>{{ info.diameter }}</span>
      </div>
      <div>
        <label>壁厚(mm)：</label>
        <span>{{ info.pipeThick }}</span>
      </div>
      <div>
        <label>投运时间：</label>
        <span>{{ info.pipeUseDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible', 'info'],
  components: {},
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>


<style lang="scss" scoped>
.pipe-info-wrapper {
  width: 520px;
  background-color: rgba(8, 56, 129, 0.9);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;

  .pipe-info-header {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    padding: 0 20px;

    i {
      float: right;
      margin-top: 16px;
      cursor: pointer;
    }
  }

  .pipe-info-content {
    padding: 0 20px 20px;
    overflow: hidden;

    >div {
      float: left;
      width: 50%;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      label {
        color: #18E3FF;
        font-weight: 700;
        width: 120px;
      }
    }
  }
}
</style>
