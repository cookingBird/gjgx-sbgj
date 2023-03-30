<template>
  <div class="Governance mainbox">
    <div class="box-title">二级单位治理情况</div>
    <div class="box-centent">
      <dv-charts :option="option" />
    </div>
    <div class="btn">
      <div>
        <span>排序方式:</span>
        <el-radio-group v-model="radio1" size="medium" fill="#4971fc">
          <el-radio-button :label="0">空间数据</el-radio-button>
          <el-radio-button :label="1">完整性</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-radio-group v-model="radio2" size="medium" fill="#4971fc">
          <el-radio-button :label="0">站场</el-radio-button>
          <el-radio-button :label="1">管道</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Governance",
  data() {
    return {
      radio1: 0,
      radio2: 0,
      data: [],
      zc: [
        {
          name: "重庆气矿",
          kjsj: 33.65,
          wzx: 9.58,
        },
        {
          name: "川东北气矿",
          kjsj: 94.23,
          wzx: 87.0,
        },
        {
          name: "川西北气矿",
          kjsj: 23.14,
          wzx: 4.23,
        },
        {
          name: "川中北部采气管理处",
          kjsj: 66.15,
          wzx: 56.45,
        },
        {
          name: "川中油气矿",
          kjsj: 7.56,
          wzx: 0.54,
        },
        {
          name: "蜀南气矿",
          kjsj: 23.56,
          wzx: 1.2,
        },
        {
          name: "储气库管理处",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "川东北作业分公司",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "长宁公司",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "四川页岩气",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "重庆页岩气",
          kjsj: 0,
          wzx: 0,
        },
      ],
      gd: [
        {
          name: "重庆气矿",
          kjsj: 86.23,
          wzx: 86.93,
        },
        {
          name: "川东北气矿",
          kjsj: 85.24,
          wzx: 81.68,
        },
        {
          name: "川西北气矿",
          kjsj: 12.38,
          wzx: 6.12,
        },
        {
          name: "川中北部采气管理处",
          kjsj: 2.45,
          wzx: 2.45,
        },
        {
          name: "川中油气矿",
          kjsj: 5.24,
          wzx: 3.43,
        },
        {
          name: "蜀南气矿",
          kjsj: 8.55,
          wzx: 9.31,
        },
        {
          name: "储气库管理处",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "川东北作业分公司",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "长宁公司",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "四川页岩气",
          kjsj: 0,
          wzx: 0,
        },
        {
          name: "重庆页岩气",
          kjsj: 0,
          wzx: 0,
        },
      ],
      option: {},
    };
  },
  watch: {
    radio1() {
      this.setoptions();
    },
    radio2() {
      this.setoptions();
    },
  },
  methods: {
    setoptions() {
      let arr = undefined;
      if (this.radio2) {
        arr = this.gd;
      } else {
        arr = this.zc;
      }
      if (!this.radio1) {
        arr = arr.sort((a, b) => {
          return b.kjsj - a.kjsj;
        });
      } else {
        arr = arr.sort((a, b) => {
          return b.wzx - a.wzx;
        });
      }
      this.option = {
        color: ["#4971fc", "#39c4ff"],
        legend: {
          data: ["空间数据", "完整性"],
          top: 20,
          iconWidth: 20,
          iconHeight: 20,
          selectAble: false,
        },
        xAxis: {
          data: arr.map((obj) => obj.name),
        },
        yAxis: {
          name: "完成率",
          data: "value",
          max: 100,
          min: 0,
        },
        grid: {
          top: 40,
          left: 50,
          right: 20,
          bottom: 20,
        },
        series: [
          {
            name: "空间数据",
            data: arr.map((obj) => obj.kjsj),
            type: "bar",
            gradient: {
              color: ["#4971fc", "#3ec2fc"],
            },
          },
          {
            name: "完整性",
            data: arr.map((obj) => obj.wzx),
            type: "bar",
            gradient: {
              color: ["#39c4ff", "#7dd8ff"],
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.setoptions();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";
.Governance {
  position: relative;
  .box-centent {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
  }
  .btn {
    position: absolute;
    display: flex;
    top: 0px;
    right: 20px;
    align-items: center;
    > div {
      margin-left: 20px;
    }
    span {
      margin-right: 10px;
    }
  }
}
</style>
