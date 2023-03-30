<template>
  <div class="tool_disk_box" id="tool_disk_box" :class="{ disk_box_open: isOpen }" draggable="true" @dragend="domDragEnd"
    :style="{
      width: isOpen ? `${radius}px` : '80px',
      height: isOpen ? `${radius}px` : '80px',
      ...defaultPosition,
    }">
    <!-- 主按钮 -->
    <div class="normal_btn" :style="{
      width: '80px',
      height: '80px',
    }">
      <!-- 六边形 -->
      <div class="hexagon_box" id="hexagon_box" @click="homeClick">
        <div class="point"></div>
      </div>
    </div>
    <!-- 飞出图标 -->
    <div class="item_list" :style="isOpen && itemListOpen">
      <div class="icon_box" v-for="(item, index) in toolboxList" :key="index" :style="{
        top: isOpen ? toLT(index).top : '50%',
        left: isOpen ? toLT(index).left : '50%',
      }">
        <!-- <img :src="item.url" class="item_icon" @click="iconClick(item)" /> -->
        <i :class="`item_icon ${item.icon || ''}`" @click="iconClick(item)"></i>
        <div class="text">
          {{ item.title }}
        </div>
      </div>
    </div>
    <!-- 扇形 -->
    <div class="sector" v-for="(item, index) in toolboxList" :key="index" @click="iconClick(item)" :style="{
      height: '150px',
      width: `${borderWidthCom()}px`,
      marginLeft: `${-borderWidthCom() / 2}px`,
      'clip-path':
        toolboxList.length > 2 ? 'polygon(0 0, 100% 0, 50% 100%)' : '',
      transform: `rotate(${index * (-360 / toolboxList.length)}deg)`,
    }"></div>
  </div>
</template>

<script>
export default {
  name: "gislife-toolbox",
  props: {
    defaultPosition: {
      type: Object,
      default: () => {
        return {
          top: "80%",
          left: "72%",
        };
      },
    },
    mapType: {
      type: String,
    },
    map: {
      type: Object,
      default: null,
    },
    globe: {
      type: Object,
      default: null,
    },
    customList: {
      type: Array,
      default: () => [],
    },
    //半径
    radius: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      itemListOpen: {
        width: "240px",
        height: "240px",
        mearsure: null,
      },
      isOpen: false, //是否展开
      defaultList: [

      ],
    };
  },
  computed: {
    toolboxList() {
      if (this.map || this.globe) {
        return this.defaultList.concat(this.customList);
      } else {
        return this.customList;
      }
    },
  },
  methods: {
    borderWidthCom() {
      if (this.toolboxList.length > 2) {
        return Math.tan(Math.PI / this.toolboxList.length) * this.radius;
      } else {
        return this.radius;
      }
    },
    iconClick(item) {
      if (item.fn) {
        return item.fn();
      }
    },
    homeClick() {
      this.isOpen = !this.isOpen;
    },
    toLT(index, radius = this.radius) {
      const deg = (360 / this.toolboxList.length) * index;
      const left = Math.round(Math.sin((deg / 180) * Math.PI) * radius) / 3.6;
      const top = Math.round(Math.cos((deg / 180) * Math.PI) * radius) / 3.6;
      return {
        left: `calc(50% - ${left}px)`,
        top: `calc(50% - ${top}px)`,
      };
    },
    domDragEnd(e) {
      const dom = document.getElementById("tool_disk_box");
      dom.style.left = `${e.clientX}px`;
      dom.style.top = `${e.clientY}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tool_disk_box {
  user-select: none;
  position: fixed;
  overflow: hidden;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: 0.2s;
  background-color: rgba(9, 37, 74, 0.733);
  z-index: 1;
  color: white;

  &>div:not(.sector) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .normal_btn {
    background: rgb(0, 19, 41);
    border-radius: 50%;
    border: 2px solid #eee;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.5s;
    z-index: 20;

    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .hexagon_box {
      width: 25px;
      height: 36px;
      border-top: 4px solid #fff;
      border-bottom: 4px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 25px;
        height: 36px;
        position: absolute;
        transform: rotate(60deg);
        border-top: 4px solid #fff;
        border-bottom: 4px solid #fff;
        top: -4px;
      }

      &::after {
        content: "";
        display: block;
        width: 25px;
        height: 36px;
        position: absolute;
        transform: rotate(120deg);
        border-top: 4px solid #fff;
        border-bottom: 4px solid #fff;
        top: -4px;
      }

      .point {
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
      }
    }
  }

  .item_list {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: 200ms;
    z-index: 19;

    .icon_box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .item_icon {
        width: 24px;
        height: 24px;
        font-size:26px;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          transform: scale(1.2);
        }
      }

      .text {
        white-space: nowrap;
      }
    }
  }

  .sector {
    position: absolute;
    left: 50%;
    top: 0;
    transform-origin: bottom center;
    cursor: pointer;

    &>img {
      width: 28px;
      height: 28px;
      margin-left: -14px;
      position: absolute;
      z-index: 18;
      transform: rotate(-90deg);
      left: 50%;
      top: 2%;
    }
  }
}

.disk_box_open {
  .normal_btn {
    background: #f4f4f4;
    border-color: #595959;

    .hexagon_box {
      border-color: #595959;

      &::before {
        border-color: #595959;
      }

      &::after {
        border-color: #595959;
      }

      .point {
        background: #595959;
      }
    }
  }

  .item_list {
    background: #04516c;
  }
}
</style>

