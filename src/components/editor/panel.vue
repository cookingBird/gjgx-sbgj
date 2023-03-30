<template>
  <div class="config-panel-container">
    <div id="layout" class="page-area">
      <grid-layout
        v-if="loaded"
        :layout.sync="layout"
        :col-num="4"
        :row-height="rowHeight"
        :isDraggable="false"
        :isResizable="false"
        :isMirrored="false"
      >
        <grid-item
          v-for="(item, index) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="index"
          :key="index"
        >
          <div
            v-if="!item.center"
            @click="handleSelectGridItem(item)"
            :index="index"
            :class="{ 'grid-item-content': true, active: item.active }"
            :draggable="item.component"
            @drop="handleDrop"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @dragleave.prevent
          >
            <img
              v-if="
                Object.prototype.toString.call(item.component) ===
                '[object Object]'
              "
              :src="item.component.image"
              alt=""
            />
          </div>
          <img
            class="center-grid"
            v-else
            src="../../assets/images/centerbg.png"
            alt=""
          />
        </grid-item>
      </grid-layout>
    </div>
    <div class="handle-area">
      <el-button class="bged" @click="handlePreview">预览</el-button>
      <el-button class="bged" @click="handleConcat">合并</el-button>
      <el-button class="bged" @click="handleSplit">拆分</el-button>
      <el-button class="bged" @click="handleClear">清空</el-button>
      <el-button class="bged" @click="handleSave">保存</el-button>
    </div>

    <page-preview ref="previewRef" :layout="layout"></page-preview>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import _ from "lodash";
import { getPageConfig, savePageConfig } from "@/api/index";
import { srceenshot } from '@/utils/tool';
import PagePreview from '../homePageConfig/Preview.vue';

let dragStartIndex = null;

export default {
  components: {
    GridLayout,
    GridItem,
    PagePreview
  },
  data() {
    return {
      rowHeight: 0,
      loaded: false,
      layout: [],
    };
  },
  computed: {
    layoutItemActiveIndex() {
      let indexArr = [];
      this.layout.forEach((item, index) => {
        item.active && indexArr.push(index);
      });
      return indexArr;
    },
  },
  mounted() {
    this.rowHeight = document.getElementById("layout").clientHeight / 3 - 14;
    this.getLayoutConfig();
  },
  methods: {
    handlePreview() {
      this.$refs['previewRef'].open();
    },
    async getLayoutConfig() {
      try {
        const { code, data } = await getPageConfig({ pageId: this.$route.query.id });
        if (code === 200) {
          this.layout = data.map((item) => {
            return {
              ...item,
              i: _.uniqueId(),
            };
          });
          console.log(this.layout);
          this.loaded = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleSelectGridItem(item) {
      if (item.center) return;
      this.$set(item, "active", item.active ? false : true);
    },
    handleDragStart(index) {
      dragStartIndex = index;
    },
    handleDrop({ target }) {
      let component;
      if (dragStartIndex !== null) {
        component = _.cloneDeep(this.layout[dragStartIndex].component);
        this.layout[dragStartIndex].component = null;
      } else {
        component = _.cloneDeep(this.$parent.dragingComponent);
      }
      const layoutIndex =
        target.tagName === "IMG"
          ? target.parentNode.getAttribute("index")
          : target.getAttribute("index");
      this.$set(this.layout[layoutIndex], "component", component);
      dragStartIndex = null;
    },
    //获取合并是纵轴还是横轴
    getActiveDirection() {
      let direction;
      const xArr = this.layoutItemActiveIndex.map(
        (index) => this.layout[index].x
      );
      const yArr = this.layoutItemActiveIndex.map(
        (index) => this.layout[index].y
      );
      if ([...new Set(xArr)].length === 1) {
        direction = "column";
      }
      if ([...new Set(yArr)].length === 1) {
        direction = "row";
      }
      return direction;
    },
    //验证选中的模块是否可合并
    validConcat(direction) {
      if (!this.layoutItemActiveIndex.length) return;
      let flag = false;
      if (direction) {
        const layoutItems = layoutItemSort.call(this, direction);
        for (let i = 0; i < layoutItems.length; i++) {
          const prev = layoutItems[i];
          const next = layoutItems[i + 1];
          if (next) {
            if (direction === "column") {
              flag = next.y === prev.y + prev.h;
            }
            if (direction === "row") {
              flag = next.x === prev.x + prev.w;
            }
            if (!flag) {
              break;
            }
          }
        }
      }
      function layoutItemSort(direction) {
        let activeLayoutItems = this.layoutItemActiveIndex.map(
          (index) => this.layout[index]
        );
        return activeLayoutItems.sort((prev, next) => {
          if (direction === "column") {
            return prev.y - next.y;
          } else if (direction === "row") {
            return prev.x - next.x;
          }
        });
      }
      return flag;
    },
    //合并
    handleConcat() {
      const direction = this.getActiveDirection();
      if (this.layoutItemActiveIndex.length && this.validConcat(direction)) {
        let col = 0;
        const firstIndex = this.layoutItemActiveIndex[0];
        let needDelLayout = [];
        this.layoutItemActiveIndex.forEach((index, i) => {
          if (direction === "column") {
            col += this.layout[index].h;
          }
          if (direction === "row") {
            col += this.layout[index].w;
          }
          if (i !== 0) needDelLayout.push(this.layout[index]);
        });
        needDelLayout.forEach((layout) => {
          const index = this.layout.findIndex((item) => layout === item);
          this.layout.splice(index, 1);
        });
        if (direction === "column") {
          this.layout[firstIndex].h = col;
        } else if (direction === "row") {
          this.layout[firstIndex].w = col;
        }
        this.layout[firstIndex].active = false;
      }
    },
    //拆分
    handleSplit() {
      if (this.layoutItemActiveIndex.length === 1) {
        let activeLayout = this.layout[this.layoutItemActiveIndex[0]];
        const { x, y, w, h } = activeLayout;
        let newLayout = [];
        if (w > 1) {
          for (let i = 1; i <= w - 1; i++) {
            newLayout.push({
              i: _.uniqueId(),
              x: x + i,
              w: 1,
              h,
              y,
            });
          }
          activeLayout.w = 1;
        } else if (h > 1) {
          for (let i = 1; i <= h - 1; i++) {
            newLayout.push({
              i: _.uniqueId(),
              x,
              w,
              h: 1,
              y: y + i,
            });
          }
          activeLayout.h = 1;
        }
        this.layout.splice(this.layoutItemActiveIndex[0] + 1, 0, ...newLayout);
        activeLayout.active = false;
      }
    },
    //清空
    handleClear() {
      this.layoutItemActiveIndex.forEach((index) => {
        this.layout[index].component = null;
      });
    },

    //保存
    async handleSave() {
      try {
        const base64 = await srceenshot('.vue-grid-layout');
        const { code, data } = await savePageConfig({
          imageUrl: base64,
          module: this.layout,
          pageId: this.$route.query.id
        });
        if (code === 200) {
          this.$message.success("保存成功");
          this.$router.go(-1);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.config-panel-container {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;

  .page-area {
    flex: 1;
    margin: 10px;
    background-color: rgba(230, 238, 247, 1);

    .vue-grid-item:not(.vue-grid-placeholder) {
      background: #fff;
    }

    .grid-item-content {
      width: 100%;
      height: 100%;
      border: 1px solid black;

      &.active {
        border: 6px solid rgba(0, 117, 254, 1);
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .center-grid {
      width: 100%;
      height: 100%;
    }
  }

  .handle-area {
    height: 40px;
    margin: 10px;
    text-align: right;
  }
}
</style>