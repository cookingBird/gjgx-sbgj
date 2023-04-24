<template>
<div class="mix-table-wrapper">
  <div
    v-if="configs.switcher"
    class="absolute mix-table__action"
  >
    <el-button
      :class="{ 'mix-table__action-item': true, 'selected': type === item }"
      v-for="item in ['混合', '表格', '地图']"
      :key="item"
      @click="type = item"
    >
      {{ item }}
    </el-button>
  </div>

  <div
    v-if="configs.map"
    v-show="type !== '表格'"
    class="shadow-content mix-table__map"
  >
    <slot v-if="mapload"></slot>
    <base-map
      v-ref="(c)=>setRef(mapRefName,c)"
      ref="basemap"
      @onLoad="mapload = true"
    ></base-map>
  </div>

  <div
    v-if="configs.table"
    v-show="type !== '地图'"
    class="shadow-content mix-table__table"
  >
    <common-table
      ref="table"
      v-ref="(c)=>setRef(tableRefName,c)"
      @handleCommand="(key, row) => $emit('handleCommand', key, row)"
      @row-click="handleRowClick"
      @onData="(data) => $emit('onData', data)"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </common-table>
  </div>

</div>
</template>

<script>
  import Map from '@/components/Map';
  import { requestDom } from '@/utils/misc';

  export default {
    components: {
      BaseMap: Map,
    },
    inject: ['setRef','getRef'],
    props: {
      mapRefName: {
        type: String,
        default: 'mixMap'
      },
      tableRefName: {
        type: String,
        default: 'mixTable'
      }
    },
    data () {
      return {
        mapload: false,
        type: '混合',
        defaultConfig: {
          switcher: true,
          map: true,
          table: true,
        },
      };
    },
    computed: {
      configs () {
        return { ...this.defaultConfig,...this.config };
      },
    },
    watch: {
      type (val) {
        this.$nextTick(() => {
          this.$refs['basemap'].resize();
          this.$refs.table.$refs.table.doLayout();
        });
      },
      mapload (val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs['basemap'].resize();
          });
        }
      },
    },
    mounted () {
      requestDom(() => this.$refs.table).then((el) => {
        // el.$slots = this.$slots
        el.$scopedSlots = this.$scopedSlots;
        el.$nextTick(() => {
          el.$forceUpdate();
          // console.log('this',this)
          // console.log('$refs.table',el)
        });
      });
    },
    methods: {
      handleRowClick (row) {
        this.$emit('row-click',row);
        row.wkt && this.$refs['basemap'].locationByLineString(row.wkt);
      },
      switchView (to) {
        this.type = to;
      },
    },
  };
</script>

<style lang="css">
  .mix-table-wrapper {
    --el-spacing-y: 7px;
    --el-p: 8px;
    --action-btn-top: -54;
    --action-btn-right: 4;
    --border-radius: 5px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .mix-table-wrapper>.mix-table__map {
    border-radius: var(--border-radius, 4px);
  }

  .mix-table-wrapper> :not(.absolute) {
    flex-grow: 1;
    flex-basis: 0;
    padding: var(--el-p) var(--el-p);
  }

  .mix-table-wrapper> :not(.absolute):not([style*="display: none"])~ :not(.absolute) {
    margin-top: var(--el-spacing-y, var(--margin-top));
  }

  .mix-table__action {
    --bgc: #306fcf;
    --f: #ffffff;
    position: absolute;
    top: calc(var(--action-btn-top) * 1px);
    right: calc(var(--action-btn-right) * 1px);
    z-index: 10;
  }

  .mix-table__action> :not([hidden])+ :not([hidden]) {
    margin-left: 0;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .mix-table__action> :not([hidden]):not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .mix-table__action>.mix-table__action-item {
    background-color: var(--f);
    color: var(--bgc);
    border-color: var(--bgc);
  }

  .mix-table__action>.mix-table__action-item:hover {
    border-color: var(--bgc);
    border-width: 1px;
  }

  .mix-table__action>.mix-table__action-item.selected {
    background-color: var(--bgc);
    color: var(--f);
  }

  .mix-table__table.shadow-content {
    background-color: transparent;
    padding: 0 0;
  }
</style>
