<template>
<main>
  <div class="px-2 py-1 page-top shadow-content bg-fff">
    <div class="font16 inline_div l-h-24rem fw_600">详情</div>
    <el-button
      class="f-r"
      @click="$emit('back')"
    >返回</el-button>
  </div>
  <div class="page-content bg-fff shadow-content">
    <section>
      <div class="content-title">基础信息</div>
      <el-descriptions
        border
        :column="3"
      >
        <el-descriptions-item label="管道名称">
          {{info.pipeName}}
        </el-descriptions-item>
        <el-descriptions-item label="管段名称">
          {{info.pipeSegmentName}}
        </el-descriptions-item>
        <el-descriptions-item label="二级单位">
          {{info.secOrgName}}
        </el-descriptions-item>
        <el-descriptions-item label="三级单位">{{ info.orgName }}</el-descriptions-item>
        <el-descriptions-item label="起点">
          {{ info.startPosition }}
        </el-descriptions-item>
        <el-descriptions-item label="终点">{{ info.endPosition }}</el-descriptions-item>
        <el-descriptions-item label="长度（km）">
          {{
            info.segmentLength
          }}
        </el-descriptions-item>
        <el-descriptions-item label="管径（mm）">
          {{
            info.diameter
          }}
        </el-descriptions-item>
        <el-descriptions-item label="壁厚（mm）">{{ info.pipeThick || null }}</el-descriptions-item>
        <el-descriptions-item label="钢级">
          {{
            info.carbonSteelClass
          }}
        </el-descriptions-item>
        <el-descriptions-item label="制管方式">{{ info.pipeMade || null}}</el-descriptions-item>
        <el-descriptions-item label="防腐材料">{{ info.pipeMaterial || null}}</el-descriptions-item>
        <el-descriptions-item label="投运日期">{{ info.pipeUseDate || null}}</el-descriptions-item>
        <el-descriptions-item label="设计压力（MPa）">
          {{
            info.desgnPressure
          }}
        </el-descriptions-item>
        <el-descriptions-item label="运行压力（MPa）">
          {{
            info.OperatingPressure
          }}
        </el-descriptions-item>
        <el-descriptions-item label="设计输量（10 m³/d）">
          {{
            info.designCapacity
          }}
        </el-descriptions-item>
        <el-descriptions-item label="运行输量（10 m³/d）">
          {{
            info.actualCapacity
          }}
        </el-descriptions-item>
        <el-descriptions-item label="运行状态">{{ info.status }}</el-descriptions-item>
        <el-descriptions-item label="四川境内长度（km）">{{ info.pipeLengthInSC || null}}</el-descriptions-item>
        <el-descriptions-item label="重庆境内长度（km）">{{ info.pipeLengthInCQ || null }}</el-descriptions-item>
        <el-descriptions-item label="途径市、州">{{ info.pipePath || null}}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ info.Note || null}}</el-descriptions-item>
      </el-descriptions>
    </section>
    <section>
      <div class="content-title">潜在影响范围</div>
      <div class="descriptions-wrapper">
        <el-descriptions
          border
          :column="3"
        >
          <el-descriptions-item label="影响半径">{{
              info.impactRadius
            }}</el-descriptions-item>
          <el-descriptions-item label="暴露半径">{{
              info.exposureRadius
            }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </section>
  </div>
</main>
</template>

<script>
  import { analyseListAPI } from '@/api/analyse';

  export default {
    props: {
      code: {
        type: String | null,
        required: true,
      },
    },
    data () {
      return {
        info: {},
      };
    },
    created () {
      console.log('detail--------------------------',this.code);
      this.getData();
    },
    methods: {
      async getData () {
        const { code,data } = await analyseListAPI({
          pageSize: 1,
          pageNo: 1,
          code: this.code,
        });
        if (code === 200) {
          this.info = data.data[0];
          console.log(this.info);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;

  .page-content {
    height: calc(100% - 48px);
    width: 100%;

    ::v-deep .el-descriptions {
      .el-descriptions-item__label {
        background: #edf4fb;
        text-align: center;
        color: #333;
        font-weight: 600;
        width: 200px;
      }

      .el-descriptions-item__content {
        width: 440px;
      }

      .el-descriptions-item__cell {
        border-color: #8cc6fb;
      }
    }

    .descriptions-wrapper {
      width: 66%;
    }
  }
}
</style>
