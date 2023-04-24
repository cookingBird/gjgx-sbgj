<template>
<div class="flex flex-col w-full h-full space-y-2">
  <div class="relative flex-grow-0 flex-shrink-0 w-auto h-12 p-1 pr-56 space-x-2 bg-white rounded shadow-content">
    <el-select v-model="queryModel.higLevel">
      <el-option
        v-for="item in highLevelOptions"
        :key="item.id"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button @click="onSearch">查询</el-button>
    <el-button @click="onRest">重置</el-button>
    <el-button
      class="float-right"
      @click="$router.go(-1)"
    >
      返回
    </el-button>
  </div>
  <div
    class="relative flex-grow"
    v-loading="loading.tableLoading"
  >
    <mix-table
      ref="table"
      :tableColumns="tableColumns"
      :config="tableConfig"
      :pageParams="{ pageNo:1,pageSize:10 }"
      :fetch="fetchData"
      :parseTableData="(data)=>({data:data.data,total:data.totalCount})"
      @onData="onTableGetData"
      @row-click="handleTableRowClick"
    >
      <div class="absolute map-layer-switcher-group">
        <LayerSwitcher
          v-model="populationShow"
          title="人居"
          :number="pipeAroundTotal.people"
          @change="togglePopulationVisible"
        ></LayerSwitcher>
        <LayerSwitcher
          v-model="placeShow"
          :number="pipeAroundTotal.place"
          title="特定场所"
          @change="togglePlaceVisible"
        ></LayerSwitcher>
      </div>
    </mix-table>
  </div>
</div>
</template>

<script>
  import MixTable from '@/components/mixTable';
  import PipeSelector from '@/components/pipeSelector';
  import * as Refs from '@/mixins/Refs';
  import mapMix from '../GhgqDiscern/mapMix';
  import LayerSwitcher from '@/components/LayerSwitcher.vue';
  import { queryPipesDetail } from './Helper'
  import * as Misc from '@/utils/misc';
  const HCA_LEVEL = {
    '0': '非高后果区',
    '1': 'Ⅰ级',
    '2': 'Ⅱ级',
    '3': 'Ⅲ级',
  }

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    mixins: [Refs.createMap('mixMap','ctx'),Refs.createTable('mixTable','ctx'),mapMix()],
    data () {
      return {
        highLevelOptions: [],
        queryModel: {},
        tableConfig: {
          isPagination: true
        },
        tableColumns: [
          {
            label: "管道名称",
            prop: "pipeSegmentName"
          },
          {
            label: "分段编号",
            prop: "code"
          },
          {
            label: "分段长度（m）",
            prop: "segmentLength"
          },
          {
            label: "起始里程（m）",
            prop: "beginMileage"
          },
          {
            label: "终止里程（m）",
            prop: "endMileage"
          },
          {
            label: "管径（mm）",
            prop: "diameter"
          },
          {
            label: "压力",
            prop: "pressure"
          },
          {
            label: "传输介质",
            prop: "transmissionMedium",
          },
          {
            label: "易燃易爆场所（个）",
            prop: "flammableExplosivePlace"
          },
          // {
          //   label: "操作",
          //   prop: "operator"
          // },
        ],
        populationShow: true,
        placeShow: true,
        pipeAroundTotal: {
          people: 300,
          place: 200
        },
        loading: {
          tableLoading: true,
        }
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      pipeSegmentCode () {
        return this.$route.query.pipeSegmentCode
      },
    },
    created () {
      this.fetchData = Misc.bindLoading.call(this,'loading.tableLoading',this.fetchData);
    },
    methods: {
      async fetchData (query) {
        const res = await queryPipesDetail(
          this.taskId,
          this.pipeSegmentCode,
          { ...this.queryModel,...query }
        )
        this.highLevelOptions = Misc.statisticFiled(res.data,'hcaLevel')
          .map(node => ({
            value: node[0],
            label: HCA_LEVEL[node[0]],
            contains: node[1]
          }))
        return Promise.resolve(res)
      },
      /**@description 选择管道 */
      async handlePipeSelect (pipe) {
        this.choosePipe = pipe
        this.pipeCode = pipe.pipeSegmentCode
        const mixTableRef = await this.syncMixTableMounted()
        mixTableRef.refresh({ pipeCode: pipe.pipeSegmentCode })
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(pipe.wkt)
        this.renderRadius(pipe)
        this.renderFeatures(pipe);
        const populationWkt = pipe.regionDto.populationWkt;
        const specificWkt = pipe.regionDto.specificWkt;
        Object.assign(this.pipeAroundTotal,{
          people: populationWkt.length,
          place: specificWkt.length
        })
      },
      /**@description 渲染所有管段、渲染地区等级、缓冲区、人居 */
      async onTableGetData (data) {
        // todo 渲染管段
        // this.renderSegmentLabel(data);
        const mapRef = await this.syncMixMapLoaded();
        //渲染管线
        this.renderPipeLine(data);
        //渲染地区等级
        this.renderLevel(data,'higLevel',mapRef);
      },
      async handleTableRowClick (row) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(row.wkt);
        const pipe = row;
        //渲染缓冲区
        this.renderRadius(pipe)
        //渲染人居
        this.renderFeatures(pipe);
      },

      togglePopulationVisible (val) {
        this.__populationLayer && this.__populationLayer.toggleVisibility(val)
      },

      togglePlaceVisible (val) {
        this.__placeLayer && this.__placeLayer.toggleVisibility(val)
      },
      async onSearch () {
        const tableRef = await this.syncMixTableMounted();
        tableRef.refresh()
      },
      async onRest () {
        this.queryModel = {}
        const tableRef = await this.syncMixTableMounted();
        tableRef.refresh()
      }
    }
  }
</script>
<style lang="css" scoped>
  ::v-deep.mix-table-wrapper>.mix-table__action {
    top: -52px;
  }
</style>
