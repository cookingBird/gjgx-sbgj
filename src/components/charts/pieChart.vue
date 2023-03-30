<!--
 * @Author: your name
 * @Date: 2021-06-02 10:47:59
 * @LastEditTime: 2021-06-02 10:51:04
 * @LastEditors: Please set LastEditors
 * @Description: 饼状图组件
 * @FilePath: \致密气一张图\src\components\charts\pieChart.vue
-->
<template>
  <div class="chart-wrapper" :id="id"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  props: {
    id: {
      require: true,
      type: String, //容器id
    },
    /**
     * 数据格式
     * data = [{
     *   name:"测试数据1",
     *   value:100
     * },{
     *   name:"测试数据2",
     *   value:200
     * }]
     * **/
    data: {
      type: Array,
    },
    text: {
      type: String,
    },
    bgcolor: {
      type: Array,
    },
    unit: {},
    subtext: {},
  },
  components: {},
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    data(val, oldval) {
      console.log(val, oldval, 111);
      this.createChart(val);
    },
  },
  mounted() {
    this.createChart(this.data);
  },
  methods: {
    createChart(data) {
      this.chart = echarts.init(document.getElementById(this.id));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        title: {
          subtext: this.subtext ? this.subtext : "",
          text: Math.round(data.reduce((total, item) => total + item.value, 0)),
          x: "center",
          y: "37%",
          textStyle: {
            color: "#fff",
            fontSize: 30,
            textAlign: "center",
          },
          subtextStyle: {
            fontFamily: "微软雅黑",
            fontSize: 16,
            color: "#fff",

          }
        },
        color: this.bgcolor ? this.bgcolor : [
          '#38fff1',
          '#57ff2a',
          '#458fc9',
          '#f45250',
          '#cbcc48',
          '#71b894',
          '#26a246',
          '#18acb1',
          '#b1b2a4',
          '#971515',
          '#4bc9e0',
        ],
        graphic: {
          type: "text",
          left: "center",
          top: "60%",
          style: {
            text: this.text,
            textAlign: "center",
            fill: "#82D1FD",
            fontSize: 16,
            fontWeight: 600,
          },
        },
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: ["50%", "70%"],
            data: data,
            label: {
              // formatter: "{b} : {c} ({d}%)",
              formatter: "{b} : {c}" + this.unit,
              color: "#fff",
            },
            //  itemStyle: {        //饼图按块划分时是否需要用线隔开，  不需要注释即可
            //             normal: {
            //                 borderWidth: 2,
            //                 borderColor: '#05366F'
            //             }
            //         }
          },
        ],
      };
      this.chart.on("click", (event) => {
        this.$emit("handleClick", event);
      });
      this.chart.setOption(option, true);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>