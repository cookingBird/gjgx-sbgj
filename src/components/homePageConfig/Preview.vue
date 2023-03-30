<template>
  <el-dialog :title="`${pageName}配置预览`" center :visible.sync="visible" custom-class="preview-dialog" fullscreen>
    <template>
      <div class="preview-wrapper">
        <grid-layout :layout.sync="layout" :col-num="4" :row-height="rowHeight" :isDraggable="false" :isResizable="false"
          :isMirrored="false">
          <grid-item v-for="(item, index) in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="index"
            :key="index">
            <template v-if="visible">
              <img class="center-grid" v-if="item.center" src="../../assets/images/centerbg.png" alt="" />
              <div class="component-wrapper" v-else>
                <template v-if="Object.prototype.toString.call(item.component) === '[object Object]'">
                  <template v-if="item.component.type === 1">
                    <component :is="item.component.code"></component>
                  </template>
                  <template v-else>
                    <iframe :src="item.component.route" frameborder="0"></iframe>
                  </template>
                </template>
              </div>
            </template>
          </grid-item>
        </grid-layout>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import { GridLayout, GridItem } from "vue-grid-layout";
const Personnel = () => import('@/components/quota/example/Personnel.vue');
const Warning = () => import('@/components/quota/example/Warning.vue');
const ProjectSituation = () => import('@/components/quota/example/ProjectSituation.vue');
const TotalAssets = () => import('@/components/quota/example/TotalAssets.vue');
const DataGovernance = () => import('@/components/quota/example/DataGovernance.vue');
const Governance = () => import('@/components/quota/example/Governance.vue');

export default {
  name: 'config-preview',
  components: {
    GridLayout,
    GridItem,
    Personnel,
    Warning,
    ProjectSituation,
    TotalAssets,
    DataGovernance,
    Governance,
  },
  props: {
    layout: {
      required: true,
    },
    pageName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      visible: false,
      rowHeight: 0,
    }
  },
  methods: {
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.rowHeight = document.querySelector(".preview-wrapper").clientHeight / 3 - 14;
      })
    },
  },
}
</script>


<style lang="scss" scoped>
 ::v-deep .preview-dialog {
  .el-dialog__body{
    height: calc(100% - 60px);
  }
  .preview-wrapper {
    height: 100%;
    width: 100%;

    .vue-grid-item {
      background-color: #fff;
      box-shadow: 3px 3px 5px #7f7f7f;
      overflow: hidden;
      padding: 10px 12px;
    }

    .component-wrapper {
      height: 100%;
      width: 100%;
      background-color: #fff;
      overflow: hidden;
    }

    .center-grid {
      width: 100%;
      height: 100%;
      position: relative;
      transition: all 0.2s;
      box-shadow: 3px 3px 5px rgb(127, 127, 127);
    }
  }
}
</style>