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
    <el-button
      type="primary"
      @click="onSearch"
    >查询</el-button>
    <el-button
      type="primary"
      @click="onRest"
    >重置</el-button>
    <el-button
      class="float-right"
      type="primary"
      @click="$router.push('/DiscernResultManage')"
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
  import * as Helper from './Helper'
  const HCA_LEVEL = {
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
        highLevelOptions: [
          {
            label: 'Ⅰ级',
            value: '1'
          },
          {
            label: 'Ⅱ级',
            value: '2'
          },
          {
            label: 'Ⅲ级',
            value: '3'
          },
        ],
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
            label: "高后果区等级",
            prop: "hcaLevel",
            format (val) {
              console.log('format-----------',val);
              return HCA_LEVEL[val];
            }
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
          people: 0,
          place: 0
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
    mounted () {
      this.getPipeDetail();
    },
    methods: {
      /**获取选择管道详情 */
      async getPipeDetail () {
        const data = await Helper.queryPipeRegion(
          this.taskIds,
          this.pipeSegmentCode
        )
        const { regionWkt,flammableWkt,specificWkt,populationWkt,wkt } = data;
        this.pipeAroundTotal = {
          people: populationWkt.length,
          place: specificWkt.length,
        };
        const mixMapRef = await this.syncMixMapLoaded();
        this.renderPipeLine([data],mixMapRef);
        this.renderRadius({ regionDto: { regionWkt } },mixMapRef);
        this.renderFeatureByType(populationWkt,'population',mixMapRef);
        this.renderFeatureByType(specificWkt,'specific',mixMapRef);
        mixMapRef.locationByLineString(wkt,{
          padding: { left: 700,right: 50 }
        })
      },
      /**@description 获取管段数据 */
      async fetchData (query) {
        const res = await queryPipesDetail(
          this.taskId,
          this.pipeSegmentCode,
          { ...this.queryModel,...query }
        )
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
        this.pipeAroundTotal = {
          people: populationWkt.length,
          place: specificWkt.length
        }
      },
      /**@description 渲染所有管段、渲染地区等级、缓冲区、人居 */
      async onTableGetData (data) {
        const mapRef = await this.syncMixMapLoaded();

        // todo 渲染管段
        this.renderSegmentLabel(data.filter(pipe => pipe.firstPoint && pipe.lastPoint));
        //渲染管线
        this.renderPipeLine(data);
        //渲染地区等级
        this.__levelLayer = this.renderLevel(data,'hcaLevel',mapRef);
        this.__levelLayer.move2Top();
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
<style lang="css" scoped>::v-deep.mix-table-wrapper>.mix-table__action {
  top: -52px;
}
</style>
