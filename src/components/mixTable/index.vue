<template>
  <div class="mix-table-wrapper">
    <div
      v-if="configs.switcher"
      class="absolute mix-table__action-btn"
    >
      <el-button
        :class="{ 'mix-table__action-btn-item': true, 'selected': type === item }"
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
      <base-map
        ref="basemap"
        @onLoad="mapload = true"
      ></base-map>
    </div>

    <div
      v-if="mapload && configs.table"
      v-show="type !== '地图'"
      class="mix-table__table shadow-content"
    >
      <common-table
        ref="table"
        @handleCommand="(key, row) => $emit('handleCommand', key, row)"
        @row-click="handleRowClick"
        @onData="(data) => $emit('onData',data)"
        v-bind="$attrs"
      >
      </common-table>
    </div>
    <slot v-if="mapload"></slot>
  </div>
</template>

<script>
  import Map from '@/components/Map';

  export default {
    components: {
      BaseMap: Map
    },
    watch: {
      type (val) {
        this.$nextTick(() => {
          this.$refs['basemap'].resize();
          this.$refs.table.$refs.table.doLayout()
        })
      },
      mapload (val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs['basemap'].resize();
          })
        }
      },
    },
    data () {
      return {
        mapload: false,
        type: "混合",
        defaultConfig: {
          switcher: true,
          map: true,
          table: true
        }
      }
    },
    computed: {
      configs () {
        return { ...this.defaultConfig,...this.config }
      }
    },
    mounted () {
      // console.log('this.$scopedSlots',this.$refs,this.$scopedSlots)
      // setTimeout(() => {
      //   this.$refs.table.setColsSlots(this.$scopedSlots)

      //   // this.$refs.table.$nextTick(() => {
      //   //   this.$refs.table.$forceUpdate()
      //   //   this.$refs.table.$refs.table.$forceUpdate()
      //   //   console.log('table.$scopedSlots',this.$refs.table)
      //   // },);
      // },2000)
    },
    methods: {
      handleRowClick (row) {
        this.$emit('row-click',row);
        row.wkt && this.$refs['basemap'].locationByLineString(row.wkt);
      },
      switchView (to) {
        this.type = to
      }
    }
  }
</script>

<style lang="css">
  .mix-table-wrapper {
    --el-y-gutter: 6;
    --el-p: 4;
    --action-btn-top: -55;
    --action-btn-right: 4;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .mix-table-wrapper> :not(.absolute) {
    flex-grow: 1;
    flex-basis: 0;
    padding: calc(var(--el-p) *1px) calc(var(--el-p) *1px);
  }

  .mix-table-wrapper> :not(.absolute):not([hidden])~ :not(.absolute):not([hidden]) {
    margin-top: calc(var(--el-y-gutter) *1px);
  }

  .mix-table__action-btn {
    --bgc: #306fcf;
    --f: #ffffff;
    position: absolute;
    top: calc(var(--action-btn-top)*1px);
    right: calc(var(--action-btn-right)*1px);
  }

  .mix-table__action-btn> :not([hidden])+:not([hidden]) {
    margin-left: 0;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .mix-table__action-btn> :not([hidden]):not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .mix-table__action-btn>.mix-table__action-btn-item {
    background-color: var(--f);
    color: var(--bgc);
    border-color: var(--bgc);
  }

  .mix-table__action-btn>.mix-table__action-btn-item:hover {
    border-color: var(--bgc);
    border-width: 1px;
  }

  .mix-table__action-btn>.mix-table__action-btn-item.selected {
    background-color: var(--bgc);
    color: var(--f);
  }
</style>
