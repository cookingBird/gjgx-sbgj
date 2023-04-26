<template>
<el-dialog
  title="管道详情"
  append-to-body
  :visible.sync="dialogVisible"
  width="80%"
  @close="close"
  :close-on-click-modal="false"
>
  <div class="diaC">
    <div
      class="item"
      v-for="(e, i) in list"
      :key="i"
    >
      <div class="item-label">{{ e.label }}</div>
      <div class="item-value">
        {{ e.format ? e.format(e.value) : e.value }}
      </div>
    </div>
  </div>
</el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
      },
      list: {}
    },
    methods: {
      close () {
        this.$emit("close",false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__title {
    color: #fff !important;
  }

  /deep/ .el-dialog__body {
    color: #fff !important;
    background-color: $--bg-color;
  }

  /deep/ .el-dialog__header {
    color: #fff !important;
    background-color: $--bg-color;
    border-bottom: 1px solid #1e8cf2;
  }

  .diaC {
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 33.3%;
      display: flex;
      min-height: 30px;

      .item-label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
        border: 1px solid #4d5160;
        background-color: $--bg-color;
        width: 50%;
      }

      .item-value {
        border: 1px solid #4d5160;
        background-color: #0b1d41;
      width: 50%;
      display: flex;
      align-items: center;
      padding-left: 10px;
    }
  }
}
</style>
