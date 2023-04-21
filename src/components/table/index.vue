<template>
<div
  class="gislife-table-container"
  v-loading="loading"
>
  <slot name="top"></slot>
  <div class="gislife-table__content">
    <el-table
      ref="table"
      class="gislife-table"
      v-bind="$attrs"
      v-on="$listeners"
      v-observe:tableEmptyRow
      :data="tableData"
      :border="initCom.border"
      :class="config.class"
      height="100%"
      style="max-width: 100%;"
    >
      <!-- 表格前部插槽 -->
      <slot name="prepend"></slot>
      <!-- 多选 -->
      <el-table-column
        type="selection"
        align="center"
        v-if="initCom.selection"
      >
      </el-table-column>
      <!-- 索引 -->
      <el-table-column
        v-if="initCom.index"
        type="index"
        :label="initCom.indexName || '序号'"
        :index="calcIndex"
        width="80px"
        align="center"
      >
      </el-table-column>
      <!-- 普通列 -->
      <template v-for="(item, index) in tableColumns">
        <Column
          v-if="item.children && item.children.length"
          :columnsHeader="item"
          :key="'custom-column' + index"
        >
        </Column>
        <el-table-column
          v-else
          ref="cols"
          v-bind="item"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :key="'el-column' + index"
          :show-overflow-tooltip="item.overflowTooltip ?? true"
        >
          <template #default="scope">
            <!-- 插槽,插槽名为对应prop,不使用可不写插槽 -->
            <slot
              :name="item.prop"
              :column="scope.column"
              :row="scope.row"
            >
              {{
                  item.format ? item.format(scope.row[item.prop]) : scope.row[item.prop]
                }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <!-- 按钮组 -->
      <el-table-column
        v-if="initCom.buttons"
        :label="initCom.buttons.label || '操作'"
        :align="initCom.buttons.align || 'center'"
        :width="initCom.buttons.width"
        :fixed="initCom.buttons.fixed"
      >
        <template v-slot="scope">
          <el-button
            v-for="(btn, index) in initCom.buttons.list"
            v-show="typeof btn.show === 'function' ? btn.show(scope.row) : true"
            :key="index"
            :type="btn.type || 'text'"
            :size="btn.size"
            @click.stop="
                (btn.click && btn.click(scope.row)) || handleCommand(btn.key, scope.row)
              "
          >
            {{ btn.label }}
          </el-button>
        </template>
      </el-table-column>
      <!-- 表格尾部插槽 -->
      <slot name="append"></slot>
      <!-- 暂无数据提示 -->
      <template v-slot:empty>
        <slot name="empty"> 暂无数据 </slot>
      </template>
    </el-table>
  </div>
  <slot name="bottom"></slot>
  <div
    v-if="isPagination"
    class="gislife-table__footer"
  >
    <pagination
      class="gislife-table__pagination"
      :pageParams.sync="pageState"
      :total="total"
      :pagerConfig="paginationConfig"
      @size-change="onSizeChange"
      @current-change="refresh()"
      @prev-click="refresh()"
      @next-click="refresh()"
    >
    </pagination>
  </div>
</div>
</template>

<script>
  import request from '@/utils/request';
  import { createXHR } from './MyXHR';
  import Column from './column';
  import pagination from './pagination.vue';
  import compLifecycleBlock from '@/mixins/compLifecycleBlock';
  export default {
    name: 'common-table',
    inheritAttrs: false,
    components: {
      Column,
      pagination,
    },
    mixins: [compLifecycleBlock()],
    props: {
      // 表头
      tableColumns: {
        type: Array,
        default: () => [],
      },
      //表格数据
      data: {
        type: Array,
        default: () => [],
      },
      //表格初始配置（多选 or index、按钮组）
      config: {
        type: Object,
        default: () => {
          return {};
        },
      },
      // 高度
      height: {
        type: [String,Number],
      },
      // 是否分页
      isPagination: {
        type: Boolean,
        default: true,
      },
      // 表格查询参数
      pageParams: {
        type: Object,
        default: () => ({
          pageNo: 1,
          pageSize: 10,
        }),
      },
      // 分页配置
      paginationConfig: {
        type: Object,
        default: () => ({
          'pageNo': 1,
          'pageSize': 10,
        }),
      },
      baseURL: {
        type: String,
        default: window.URL_CONFIG.baseUrl,
      },
      // 获取表格数据接口Api
      url: {
        type: String,
      },
      // 查询参数
      query: {
        Type: Object,
        default () {
          return {};
        },
      },
      // 请求方法（默认POST）
      reqMethods: {
        Type: String,
        default: 'POST',
      },
      // 解析表格数据
      parseTableData: {
        Type: Function,
        default () {
          return ({ data,code }) => {
            if (code == 200) {
              return { data: data.data,total: data.totalCount };
            }
            return {};
          };
        },
      },
      pageNo: {
        Type: String,
        default: 'pageNo',
      },
      pageSize: {
        Type: String,
        default: 'pageSize',
      },
      fetch: Function
    },
    data () {
      return {
        total: 30,
        loading: false,
        tableData: this.data,
        maxHeight: 300,
        pageState: this.pageParams
      };
    },
    computed: {
      initCom () {
        const config = this.config ?? {};
        return {
          border: config.border ?? true,
          index: config.index ?? true,
          ...config,
        };
      },
      queryData: {
        get () {
          return { ...this.query,...this.pageState };
        },
        set (val) {
          this.$emit('changeQuery',val);
        },
      },
    },

    created () {
      this.refresh();
    },

    methods: {
      // 按钮组操作
      handleCommand (key,row) {
        this.$emit('handleCommand',key,row);
      },
      // 刷新数据
      async refresh (paras) {
        let params = Object.assign({},this.queryData,paras);
        this.loading = true;
        try {
          let dataS = await this.getData(params);
          if (dataS) {
            let { data,total } = this.parseTableData(dataS);
            this.tableData = data;
            this.total = total;
            this.$emit('onData',data);
          }
        } catch (error) {
          console.error(error);
          this.$message.error('获取表格信息失败');
        } finally {
          this.loading = false;
        }
      },
      // 获取数据
      async getData (query) {
        if (!this.url && !this.fetch) {
          return;
        }
        if (this.fetch) {
          return this.fetch(query)
        } else {
          const params = {
            baseURL: this.baseURL,
            url: this.url,
            method: this.reqMethods,
            params: query,
            data: query
          };
          return request(params);
        }
        // return this.__xhr.send({
        //   params: query,
        //   data: query
        // }).then(res => res.data)
      },

      calcIndex (index,pgCfg = 'pageState') {
        if (this.isPagination) {
          const { pageNo,pageSize } = this[pgCfg]
          return index + (pageNo - 1) * pageSize + 1
        } else {
          return index + 1
        }
      },

      onSizeChange (val) {
        console.log('sizeChange',val);
        this.refresh()
      }
    },
  };
</script>

<style lang="css">
  .gislife-table-container {
    --inner-margin-top: 8px;
    --inner-el-padding: 8px;
    --inner-border-radius: 4px;
    max-height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .gislife-table-container>* {
    flex-grow: 0;
    flex-shrink: 0;
    background-color: #fff;
    flex-basis: 0;
  }

  .gislife-table {
    overflow: hidden;
  }

  .gislife-table-container>.gislife-table__content {
    flex-grow: 1;
    padding: var(--el-p, var(--inner-el-padding)) var(--el-p, var(--inner-el-padding));
    background-color: #fff;
    flex-basis: 0;
    overflow: hidden;
  }

  .gislife-table-container> :not(.absolute) {
    border-radius: var(--border-radius, var(--inner-border-radius));
  }



  .gislife-table-container> :not([hidden])~ :not([hidden]) {
    margin-top: var(--el-spacing-y, var(--inner-margin-top));
  }

  .gislife-table__pagination.el-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--el-p, var(--inner-el-padding)) var(--el-p, var(--inner-el-padding));
  }
</style>
