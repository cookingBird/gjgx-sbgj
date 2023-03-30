<template>
  <div :style="loading ? 'padding-top: 50px;' : ''">
    <module
      v-loading="loading"
      :datalist="filterData"
      :optionsKey="optionsKey"
      :defaultSelect="defaultSelect"
      :showLevel="showLevel"
      :defaultOpen="defaultOpen"
      @select="selectHandle">
    </module>
  </div>
</template>

<script>
import module from './module.vue';
export default {
  props: {
    data: {
      Type: Array,
      require: true,
    },
    // 过滤项
    filterTitle: {
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
        return {
          title: 'orgName',
          key: 'id',
          children: 'children',
          count: 'count'
        };
      },
    },
    // 默认选中
    defaultSelect: {
      default: '',
    },
    // 树显示最高层级
    showLevel: {
      type: Number,
      default: 4,
    },
  },
  components: {
    module,
  },
  computed: {
    // 机构树处理
    filterData() {
      let data = (Array.isArray(this.data) && this.data) || [];
      if (!this.filterTitle?.length) return data;
      return this.recursion(data, (v, ix, arr) => {
        if (this.filterTitle.includes(v?.[this.optionsKey.title])) {
          arr.splice(ix, 1);
        }
      });
    },
  },
  data() {
    return {
      loading: false,
      // 根节点权限ID
      treeRootId: '',
    };
  },
  watch: {},
  methods: {
    // 选择节点
    selectHandle(e) {
      this.$emit('select', e);
    },
    recursion(data, func) {
      return (
        Array.isArray(data) &&
        data.map((v, ix) => {
          if (v?.[this.optionsKey?.children]?.length) {
            return this.recursion(data[this.optionsKey?.children]);
          }
          return func(v, ix, data);
        })
      );
    },
  },
};
</script>
