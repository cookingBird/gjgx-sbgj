<template>
  <div class="dwgdhz deep-mainbox">
    <div class="deep-box-title">单位管道汇总</div>
    <div class="box-content" v-loading="loading">
      <PieChart
        @handleClick="handleClick"
        id="dwgdhz"
        :data="data"
        :subtext="subtext"
        :unit="unit"
      />
    </div>
    <div class="operate">
      <el-radio-group v-model="type" size="mini" @change="changetype">
        <el-radio-button label="长度"></el-radio-button>
        <el-radio-button label="数量"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/charts/pieChart.vue';
import { pipe } from '@/api/gdzc.js';
export default {
  name: "dwgdhz",
  components: {
    PieChart
  },
  data() {
    return {
      data: [],
      unit: "",
      type: "长度",
      subtext: "总长（KM）",
      loading: false
    };
  },
  mounted() {
    this.changetype(this.type)
  },
  methods: {
    handleClick(e) {
      console.log(e);
      this.$emit('fullscreenChange', false);
      this.$emit('callMap', {
        excutor: (SEC_ORG_NAME, ORG_NAME) => {
          this.$refs['table'].open({
            tableName: "DC_PIPELINE_PL",
            url: window.URL_CONFIG.baseUrl + "/layerQuery/layerPageQuery",
            tableType: 1,
            requestParams: {
              optional: [
                {
                  columnName: "SEC_ORG_NAME",
                  columnValue: SEC_ORG_NAME,
                  operator: "1",
                },
                {
                  columnName: "ORG_NAME",
                  columnValue: ORG_NAME,
                  operator: "1",
                },
                {
                  columnName: "DEL_FLAG",
                  columnValue: '0',
                  operator: "2",
                },
              ],
            },
            checkDetail(row, cb) {
              cb();
            },
          })
        },
        param: {
          SEC_ORG_NAME: this.$store.state.auth.orgLevel == 1 ? e.name : "",
          ORG_NAME: this.$store.state.auth.orgLevel == 1 ? "" : e.name
        }
      })
    },
    changetype(e) {

      let m = new Map([
        ["长度", { type: 1, unit: "", subtext: "总长（KM）" }],
        ["数量", { type: 2, unit: "", subtext: "数量（条）" }],
      ]);
      this.subtext = m.get(e).subtext;
      this.unit = m.get(e).unit;
      let type = m.get(e).type;
      this.pipe(type)
    },
    async pipe(type) {
      this.loading = true
      let res = await pipe({ type, data: { secOrgName: this.$store.state.auth.secOrgName, orgName: this.$store.state.auth.orgName } })
      if (res.code == 200) {
        this.data = res.data
      }
      this.loading = false
    }
  },

};
</script>

<style lang="scss" scoped>
.dwgdhz {
  position: relative;
  .operate {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
</style>
