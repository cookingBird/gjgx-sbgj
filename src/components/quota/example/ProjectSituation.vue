<template>
  <div class="ProjectSituation mainbox">
    <div class="box-title">大修项目情况</div>
    <div class="box-centent">
      <div class="header">
        <div class="ejdw">二级单位</div>
        <div class="xm">项目</div>
        <div class="dxlx">大修类型</div>
        <div class="xmzt">项目状态</div>
      </div>
      <div class="bottom">
        <vue-seamless-scroll :data="listData" class="seamless-warp">
          <ul class="item">
            <li v-for="(item, index) in listData" :key="index">
              <div class="ejdw">{{ item.ejdw }}</div>
              <div class="xm">{{ item.xm }}</div>
              <div class="dxlx">{{ item.dxlx }}</div>
              <div class="xmzt">
                <span
                  :class="item.xmzt == 0 ? 'cg' : item.xmzt == 1 ? 'js' : 'ss'"
                ></span>
                {{
                  item.xmzt == 0 ? " 采购" : item.xmzt == 1 ? "结算" : "实施"
                }}
              </div>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectSituation",
  data() {
    return {
      listData: [
        {
          ejdw: "蜀南气矿",
          xm: "检修",
          dxlx: "定检缺陷修复",
          xmzt: 0,
        },
        {
          ejdw: "输气管理处",
          xm: "2022定期检测",
          dxlx: "工艺大修",
          xmzt: 1,
        },
        {
          ejdw: "川东北七气矿",
          xm: "管线智能检测",
          dxlx: "智能检测",
          xmzt: 2,
        },
        {
          ejdw: "重庆气矿",
          xm: "缺陷修复",
          dxlx: "智能检测修复",
          xmzt: 2,
        },
        {
          ejdw: "重庆气矿",
          xm: "完整性评价",
          dxlx: "其他",
          xmzt: 2,
        },
        {
          ejdw: "蜀南气矿",
          xm: "检修",
          dxlx: "定检缺陷修复",
          xmzt: 2,
        },
        {
          ejdw: "输气管理处",
          xm: "2022定期检测",
          dxlx: "工艺大修",
          xmzt: 2,
        },
        {
          ejdw: "川东北七气矿",
          xm: "管线智能检测",
          dxlx: "智能检测",
          xmzt: 2,
        },
        {
          ejdw: "重庆气矿",
          xm: "缺陷修复",
          dxlx: "智能检测修复",
          xmzt: 2,
        },
        {
          ejdw: "重庆气矿",
          xm: "完整性评价",
          dxlx: "其他",
          xmzt: 2,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/main.scss";
.ProjectSituation {
  .box-centent {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    overflow: hidden;
    .header {
      display: flex;
      background-color: #f4faff;
      height: 40px;
      line-height: 40px;
      align-items: center;
      color: #333;
      padding: 0 6px;
    }
    .ejdw {
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .xm {
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dxlx {
      width: 25%;
      text-align: center;
    }
    .xmzt {
      width: 15%;
      text-align: center;
    }
    .bottom {
      flex: 40px 1;
      overflow: hidden;
      .seamless-warp {
        height: 100%;
        overflow: hidden;
        li {
          display: flex;
          color: #333;
          margin-bottom: 6px;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .ss {
            background-color: rgb(255, 90, 0);
          }
          .js {
            background-color: rgb(39, 162, 51);
          }
          .cg {
            background-color: rgb(255, 147, 21);
          }
        }
      }
    }
  }
}
</style>
