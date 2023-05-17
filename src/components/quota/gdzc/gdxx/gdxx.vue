<template>
  <div class="gdxx deep-mainbox">
    <div class="deep-box-title">管道信息</div>
    <div class="box-content" v-loading="loading">
      <div class="item-box">
        <div class="item" v-for="(e, i) in detailList" :key="i">
          <div class="item-label">{{ e.label }}</div>
          <div
            class="item-value"
            :title="e.format ? e.format(e.value) : e.value"
          >
            {{ e.format ? e.format(e.value) : e.value }}
          </div>
        </div>
      </div>
    </div>
    <div class="operate">
      <el-autocomplete
        clearable
        size="mini"
        v-model="searchvalue"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      >
        <span slot="append" @click="handleSelect"
          ><i
            class="el-icon-search"
            style="font-size: 16px; cursor: pointer"
          ></i
        ></span>
      </el-autocomplete>
      <el-button
        type="primary"
        size="mini"
        style="margin: 0 10px"
        @click="dialogVisible = true"
        >详细信息</el-button
      >
    </div>
    <DetailDia
      :list="moreDetailList"
      :dialogVisible="dialogVisible"
      @close="close"
    />
  </div>
</template>

<script>

import { toHump } from "@/utils/tool"
import DetailDia from "../common/detailDia.vue"
import { TRANSFER_MATERIAL_C, CARBON_STEEL_CLASS_C, PROTECT_TYPE_C, INNER_COATING_TYPE_C, OUT_COATING_TYPE_C, INSULATION_TYPE_C, HEAT_TYPE_C, REPAIRED_MOUTH_TYPE_C, STATUS_C } from "@/components/quota/gdzc/common/translation"
import { pipeInfo, pipeNameList } from '@/api/gdzc.js';
export default {
  name: "gdxx",
  components: {
    DetailDia
  },
  data() {
    return {
      restaurants: [],
      searchvalue: '',
      timeout: null,
      detailList: [{ label: "管道名称：", value: "", prop: toHump("NAME") },
      { label: "设计输量(万方/天)：", value: "", prop: toHump("DESIGN_CAPACITY") },
      { label: "二级单位：", value: "", prop: toHump("SEC_ORG_NAME") },
      { label: "三级单位：", value: "", prop: toHump("ORG_NAME") },
      { label: "长度(km)：", value: "", prop: toHump("LENGTH"), },
      { label: "管径(mm)：", value: "", prop: toHump("DIAMETER") },
      { label: "壁厚(mm)：", value: "", prop: toHump("WALLTHICK") },
      { label: "起点场站阀室：", value: "", prop: toHump("BEGIN_CODE") },
      { label: "终点场站阀室：", value: "", prop: toHump("END_CODE") },
      {
        label: "传输介质:", value: "", prop: toHump("TRANSFER_MATERIAL"), format: (value) => {
          if (TRANSFER_MATERIAL_C[value]) { return TRANSFER_MATERIAL_C[value] } else {
            return value
          }
        }
      }],

      moreDetailList: [{ label: "管道名称：", value: "", prop: toHump("NAME") },
      { label: "所属二级单位：", value: "", prop: toHump("SEC_ORG_NAME") },
      { label: "所属三级单位：", value: "", prop: toHump("ORG_NAME") },
      { label: "起点站场阀室：", value: "", prop: toHump("BEGIN_CODE") },
      { label: "终点站场阀室：", value: "", prop: toHump("END_CODE") },
      { label: "管径(mm)：", value: "", prop: toHump("DIAMETER") },
      { label: "壁厚(mm)：", value: "", prop: toHump("WALLTHICK") },
      { label: "长度(km)", value: "", prop: toHump("LENGTH") },
      {
        label: "钢材级别：", value: "", prop: toHump("CARBON_STEEL_CLASS"), format: (value) => {
          if (CARBON_STEEL_CLASS_C[value]) { return CARBON_STEEL_CLASS_C[value] } else {
            return value
          }
        }
      },
      { label: "设计压力（Mpa）：", value: "", prop: toHump("DESGN_PRESSURE") },
      {
        label: "输送介质：", value: "", prop: toHump("TRANSFER_MATERIAL"), format: (value) => {
          if (TRANSFER_MATERIAL_C[value]) { return TRANSFER_MATERIAL_C[value] } else {
            return value
          }
        }
      },
      { label: "设计输量（10⁴m³/d）：", value: "", prop: toHump("DESIGN_CAPACITY") },
      { label: "实际输量（10⁴m³/d）：", value: "", prop: toHump("ACTUAL_CAPACITY") },
      { label: "运行压力（Mpa）：", value: "", prop: toHump("OPERATING_PRESSURE") },
      {
        label: "阴保方式：", value: "", prop: toHump("PROTECT_TYPE"), format: (value) => {
          if (PROTECT_TYPE_C[value]) { return PROTECT_TYPE_C[value] } else {
            return value
          }
        }
      },
      { label: "投产日期：", value: "", prop: toHump("PROD_DATE") },
      {
        label: "内防腐方式：", value: "", prop: toHump("INNER_COATING_TYPE"), format: (value) => {
          if (INNER_COATING_TYPE_C[value]) { return INNER_COATING_TYPE_C[value] } else {
            return value
          }
        }
      },
      {
        label: "外防腐方式：", value: "", prop: toHump("OUT_COATING_TYPE"), format: (value) => {
          if (OUT_COATING_TYPE_C[value]) { return OUT_COATING_TYPE_C[value] } else {
            return value
          }
        }
      },
      {
        label: "保温方式：", value: "", prop: toHump("INSULATION_TYPE"), format: (value) => {
          if (INSULATION_TYPE_C[value]) { return INSULATION_TYPE_C[value] } else {
            return value
          }
        }
      },
      {
        label: "伴热方式：", value: "", prop: toHump("HEAT_TYPE"), format: (value) => {
          if (HEAT_TYPE_C[value]) { return HEAT_TYPE_C[value] } else {
            return value
          }
        }
      },
      { label: "设计温度（℃）：", value: "", prop: toHump("DESIGN_TEMP") },
      { label: "最大允许操作压力（Mpa）：", value: "", prop: toHump("MAX_OPERATION_PRESSURE") },
      { label: "运行温度（℃）：", value: "", prop: toHump("RUN_TEMP") },
      { label: "设计CO2含量（10⁴m³/d）：", value: "", prop: toHump("DESIGN_CARBON_DIOXIDE") },
      { label: "设计H2S含量（10⁴m³/d）：", value: "", prop: toHump("DESIGN_HYDROGEN_SULFIDE") },
      {
        label: "补口方式：", value: "", prop: toHump("REPAIRED_MOUTH_TYPE"), format: (value) => {
          if (REPAIRED_MOUTH_TYPE_C[value]) { return REPAIRED_MOUTH_TYPE_C[value] } else {
            return value
          }
        }
      },
      {
        label: "状态：", value: "", prop: toHump("STATUS"), format: (value) => {
          if (STATUS_C[value]) { return STATUS_C[value] } else {
            return value
          }
        }
      },
      { label: "备注：", value: "", prop: toHump("REMARKS") },],
      loading: false,
      dialogVisible: false
    };
  },
  async mounted() {
    await this.pipeNameList()
    await this.pipeInfo()

  },
  methods: {
    close() {
      this.dialogVisible = false
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 0 * Math.random());
    },
    createStateFilter(queryString) {
      return (searchvalue) => {
        return (searchvalue.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      if (!this.searchvalue) {
        this.searchvalue = this.restaurants[0].value
      }
      this.pipeInfo()
    },
    async pipeInfo() {
      this.loading = true
      let res = await pipeInfo({ name: this.searchvalue })
      if (res.code == 200) {
        if (res.data) {
          this.detailList = this.detailList.map(e => {
            return { ...e, value: res.data[e.prop] }
          })

          this.moreDetailList = this.moreDetailList.map(e => {
            return { ...e, value: res.data[e.prop] }
          })
        } else {
          this.detailList = this.detailList.map(e => {
            return { ...e, value: "" }
          })
          this.moreDetailList = this.moreDetailList.map(e => {
            return { ...e, value: "" }
          })
        }

      }
      this.loading = false
    },

    async pipeNameList() {
      let res = await pipeNameList({})
      if (res.code == 200) {
        this.restaurants = res.data.map(e => {
          return { value: e }
        })
        this.searchvalue = res.data[0]
      }

    }
  },

};
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  width: 150px;
  color: #fff !important;
  background: $--main-color1;
}
::v-deep .el-input-group__append {
  background: $--main-color1;
}
.gdxx {
  position: relative;
  .operate {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
</style>
