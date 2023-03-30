<template>
  <el-table-column
    :prop="columnsHeader.prop"
    :label="columnsHeader.label"
    :width="columnsHeader.width"
    :min-width="columnsHeader.minWidth"
    :fixed="columnsHeader.fixed"
    :align="columnsHeader.align || 'center'"
    :show-overflow-tooltip="overflowTooltipCom(columnsHeader.overflowTooltip)"
  >
    <div v-for="item in columnsHeader.children" :key="item.prop">
      <Column
        v-if="item.children && item.children.length"
        :coloumn-header="item"
      ></Column>
      <el-table-column
        v-else
        :sortable="item.sortable"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :fixed="item.fixed"
        :align="item.align || 'center'"
        :show-overflow-tooltip="overflowTooltipCom(item.overflowTooltip)"
      >
        <template #default="scope">
          <!-- 插槽,插槽名为对应prop,不使用可不写插槽 -->
          <slot
            :name="item.prop"
            :index="scope.$index"
            :column="scope.column"
            :row="scope.row"
          >
            {{ item.format ? item.format(scope.row) : scope.row[item.prop] }}
          </slot>
        </template></el-table-column
      >
    </div>
  </el-table-column>
</template>

<script>
export default {
  name: 'Column',
  props: {
    columnsHeader: {
      type: Object,
      required: true,
    },
  },
  methods: {
    //超出气泡框
    overflowTooltipCom: (val) => val ?? true,
  },
}
</script>
