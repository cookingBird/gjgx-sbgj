<template>
<div class="flex flex-col w-full h-full space-y-2">
  <div class="flex items-center flex-grow-0 flex-shrink-0 w-auto h-12 space-x-2 bg-white rounded shadow-content mr-52">
    <el-select v-model="queryModel.higLevel">
      <el-option
        v-for="item in pipeList"
        :key="item.id"
      >
        {{ item.label }}
      </el-option>
    </el-select>
    <el-button @click="onSearch">查询</el-button>
    <el-button @click="onRest">重置</el-button>
    <el-button
      class="float-right"
      @click="$route.go(-1)"
    >
      返回
    </el-button>
  </div>
  <div
    class="relative flex-grow"
    v-loading="loading"
  >
    <mix-table
      ref="table"
      :tableColumns="tableColumns"
      :config="tableConfig"
      @onData="onTableGetData"
      @row-click="handleTableRowClick"
      reqMethods="POST"
      url="/result/resultListVo"
      :query="query"
      :pageParams="{ pageNo:-1,pageSize:10 }"
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
  import mapLifecycleRef from '@/mixins/mapLifecycleRef';
  import tableRef from '@/mixins/tableRef';
  import mapMix from '../GhgqDiscern/mapMix';
  import LayerSwitcher from '@/components/LayerSwitcher.vue'

  export default {
    components: {
      MixTable,
      PipeSelector,
      LayerSwitcher
    },
    mixins: [mapLifecycleRef(),tableRef(),mapMix()],
    data () {
      return {
        pipeList: [],
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
        loading: true,
      }
    },
    computed: {
      taskId () {
        return this.$route.query.id
      },
      taskName () {
        return this.$route.query.taskName
      },
      pipeSegmentCode () {
        return this.$route.query.pipeSegmentCode
      },
      query () {
        return {
          keyWords: '',
          pageNo: 1,
          pageSize: -1,
          startTime: '',
          endTime: '',
          status: 0,
          taskId: this.taskId,
          higLevel: this.queryModel.higLevel,
          pipeSegmentCode: this.pipeSegmentCode
        }
      }
    },
    methods: {
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
      /**@description 渲染所有管段、渲染分段标识 */
      onTableGetData (data) {
        // todo 渲染管段
        this.renderSegmentLabel(data);
      },

      async handleTableRowClick (row) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.locationByLineString(row.wkt)
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
