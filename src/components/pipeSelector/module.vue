<template>
  <div class="tree-module">
    <ul>
      <li
        v-for="(item, ind) in datalist"
        :key="ind"
        :class="mathClass(item)"
      >
        <div
          class="tree-title tree-title-ell tree-title-open"
          :class="{ 'tree-title-bg': item[optionsKey.key] === selectKey }"
          :style="'padding-left: ' + (level * 30 + 10) + 'px'"
          @click="selectHandle(item)"
        >
          <!-- 左侧图标 -->
          <span class="tree-title-icon">
            <img
              v-if="level === 0"
              :src="require('@/assets/images/home.svg')"
              alt=""
            />
            <img
              v-else-if="
                (showLevel === 0 || level < showLevel - 1) &&
                item[optionsKey.children] &&
                item[optionsKey.children].length
              "
              :src="require('@/assets/images/branch.svg')"
              alt=""
              srcset=""
            />
            <img
              v-else
              :src="require('@/assets/images/subNode.svg')"
              alt=""
            />
          </span>
          <span :title="
            item[optionsKey.count] || item[optionsKey.count] === 0
              ? item[optionsKey.title] + '(' + item[optionsKey.count] + ')'
              : item[optionsKey.title]
          ">
            {{ item[optionsKey.title] }}
          </span>
          <!-- 数量 -->
          <span v-if="item[optionsKey.count] || item[optionsKey.count] === 0"> ({{ item[optionsKey.count] }})</span>
          <!-- 收拢图标 -->
          <span
            class="tree-title-icon-open"
            v-if="
              (showLevel === 0 || level < showLevel - 1) &&
              level < 4 &&
              item[optionsKey.children] &&
              item[optionsKey.children].length
            "
          >
            <em
              :class="[hiddenChild.indexOf(item[optionsKey.key]) >= 0 ? 'above' : 'reverse', 'arrow']"
              @click.stop="hiddenChildHandle(item)"
            ></em>
          </span>
        </div>
        <!-- 加载子级节点 -->
        <mymodule
          v-if="
            (showLevel === 0 || level < showLevel - 1) &&
            hiddenChild.indexOf(item[optionsKey.key]) >= 0 &&
            level < 4 &&
            item[optionsKey.children] &&
            item[optionsKey.children].length
          "
          :datalist="item[optionsKey.children]"
          :optionsKey="optionsKey"
          :defaultSelect="selectKey"
          :showLevel="showLevel"
          :level="level + 1"
          :defaultOpen="defaultOpen"
          @select="selectHandle"
        >
        </mymodule>
      </li>
    </ul>
  </div>
</template>

<script>
  import mymodule from './module.vue';
  export default {
    name: 'mymodule',
    props: {
      datalist: {
        type: Array,
        default: () => {
          return [];
        },
      },
      // 默认展开
      defaultOpen: {
        type: Boolean,
        default: false,
      },
      // 配置回显字段
      optionsKey: {
        type: Object,
        default: () => {
          return {};
        },
      },
      // 默认选中
      defaultSelect: {
        default: '',
      },
      // 层级
      level: {
        default: 0,
      },
      // 树显示最高层级
      showLevel: {
        default: 0,
      },
    },
    components: {
      mymodule,
    },
    data () {
      return {
        // 选中状态
        selectKey: '',
        // 展开子级
        hiddenChild: [],
      };
    },
    watch: {
      defaultSelect (e) {
        this.selectKey = e;
      },
      datalist () {
        if (this.defaultOpen) {
          for (var ind in this.datalist) {
            if (this.datalist[ind][this.optionsKey.children] && this.datalist[ind][this.optionsKey.children].length) {
              this.hiddenChild.push(this.datalist[ind][this.optionsKey.key]);
            }
          }
        }
      },
    },
    mounted () {
      if (this.defaultSelect) {
        this.selectKey = this.defaultSelect;
      }
      if (this.defaultOpen) {
        for (var ind in this.datalist) {
          if (this.datalist[ind][this.optionsKey.children] && this.datalist[ind][this.optionsKey.children].length) {
            this.hiddenChild.push(this.datalist[ind][this.optionsKey.key]);
          }
        }
      }
    },
    methods: {
      // 收拢子级
      hiddenChildHandle (item) {
        if (this.hiddenChild.filter(i => i === item[this.optionsKey.key]).length) {
          this.hiddenChild = this.hiddenChild.filter(i => i !== item[this.optionsKey.key]);
        } else {
          this.hiddenChild.push(item[this.optionsKey.key]);
        }
      },
      // 计算class样式
      mathClass (item) {
        var className = '';
        if (item[this.optionsKey.children] && item[this.optionsKey.children].length) {
          className += ' add-before ';
        }
        if (this.level) {
          className += ' add-after ';
        }
        className += ' add-before-' + this.level;
        // 反馈
        return className;
      },
      // 选择一行
      selectHandle (e) {
        this.selectKey = e[this.optionsKey.key];
        this.$emit('select',e);
      },
    },
  };
</script>

<style lang="scss" scoped>
.tree-module {
  width: 100%;
  max-width: 400px;

  li.add-before {
    position: relative;

    &:before {
      content: '';
      height: calc(100% - 48px);
      border-left: #e6e6e6 dotted 2px;
      position: absolute;
      z-index: 2;
      left: 18px;
      top: 29px;
    }
  }

  li.add-after {
    position: relative;

    &:after {
      content: '';
      width: 20px;
      border-top: #e6e6e6 dotted 2px;
      position: absolute;
      z-index: 2;
      left: 18px;
      top: 19px;
    }
  }

  li.add-before-1 {
    &:before {
      left: 46px;
    }
  }

  li.add-before-2 {
    &:before {
      left: 74px;
    }

    &:after {
      left: 46px;
    }
  }

  li.add-before-3 {
    &:before {
      left: 102px;
    }

    &:after {
      left: 74px;
    }
  }

  li.add-before-4 {
    &:before {
      left: 130px;
    }

    &:after {
      left: 102px;
    }
  }

  li.add-before-5 {
    &:after {
      left: 130px;
    }
  }

  .tree-title {
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    position: relative;
    cursor: pointer;
    z-index: 1;

    .tree-title-icon {
      margin-right: 5px;
      color: #0b79df;

      img {
        display: inline;
        vertical-align: middle;
      }
    }

    &:hover {
      color: #0b79df;
    }
  }

  .tree-title-open {
    padding-right: 30px;

    .tree-title-icon-open {
      position: absolute;
      right: 10px;
      top: 0px;

      .arrow {
        display: inline-block;
        width: 15px;
        height: 10px;
        background: url('~@/assets/images/arrow.svg') no-repeat;
        background-size: 14px;
        cursor: pointer;
        transition: transform 0.3s;
      }
    }
  }

  .above {
    transform: rotate(0deg);
  }

  .reverse {
    transform: rotate(180deg);
  }

  .tree-title-ell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tree-title-bg {
    color: #fff !important;
    background-color: $--cas-color1;
    font-size: 18px;

    .tree-title-icon {
      color: #fff;
    }
  }
}
</style>
