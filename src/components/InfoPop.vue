<template>
<div class="pipe-info-wrapper">
  <div class="pipe-info-header">
    <span>管道详情</span>
    <i
      class="el-icon-close"
      @click="onClose"
    ></i>
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
    props: {
      info: Object,
      onClose: Function
    },
  };
</script>
