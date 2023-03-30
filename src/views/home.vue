<!-- 首页 -->
<template>
  <main>
    <div
      id="GridContainer"
      class="relative content-inner"
    >
      <grid-layout
        v-if="loaded"
        :layout.sync="pageConfig"
        :col-num="4"
        :row-height="rowHeight"
        :isDraggable="false"
        :isResizable="false"
        :isMirrored="false"
      >
        <grid-item
          v-for="(item, index) in pageConfig"
          :key="item.id"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="index"
        >
          <div
            class="map-wrapper"
            id="MapWrapper"
            v-if="item.center"
          >
            <micro-app
              :src="mapurl"
              :microAppCode="microAppCode"
              frameborder="0"
            ></micro-app>
            <i
              v-show="boxshow"
              @click="boxshow = false"
              class="el-icon-full-screen"
            ></i>
            <i
              v-show="!boxshow"
              @click="boxshow = true"
              class="el-icon-aim"
            ></i>
          </div>
          <div
            class="component-wrapper"
            v-else
          >
            <template v-if="item.component">
              <template v-if="item.component.type === 1">
                <component
                  :is="item.component.code"
                  @fullscreenChange="(val) => (boxshow = val)"
                  @callMap="callMap"
                >
                </component>
              </template>
              <template v-else>
                <iframe
                  :src="item.component.route"
                  frameborder="0"
                ></iframe>
              </template>
            </template>
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <page-empty v-show="!viewPageId && controllerLoaded"></page-empty>
    <page-controller @loaded="controllerLoaded = true"></page-controller>
  </main>
</template>

<script>
const Personnel = () => import('@/components/quota/example/Personnel.vue');
const Warning = () => import('@/components/quota/example/Warning.vue');
const ProjectSituation = () => import('@/components/quota/example/ProjectSituation.vue');
const TotalAssets = () => import('@/components/quota/example/TotalAssets.vue');
const DataGovernance = () => import('@/components/quota/example/DataGovernance.vue');
const Governance = () => import('@/components/quota/example/Governance.vue');
const dwgdhz = () => import('@/components/quota/gdzc/dwgdhz/dwgdhz.vue');//单位管道汇总
const gdxx = () => import('@/components/quota/gdzc/gdxx/gdxx.vue');//管道信息
const glzngdhz = () => import('@/components/quota/gdzc/glzngdhz/glzngdhz.vue');//管理职能管道汇总
import { GridLayout,GridItem } from 'vue-grid-layout';
import { getPageConfig } from '@/api/index';
import PageEmpty from '@/components/home/empty.vue';
import PageController from '@/components/home/controller.vue';

let originalStyle = {};

export default {
  name: 'home',
  components: {
    Personnel,
    Warning,
    ProjectSituation,
    TotalAssets,
    DataGovernance,
    Governance,
    GridLayout,
    GridItem,
    PageEmpty,
    PageController,
    // 管道
    dwgdhz,
    gdxx,
    glzngdhz
  },
  data () {
    return {
      boxshow: true,
      microAppCode: 'GJGX_MAP',
      mapurl: `${window.URL_CONFIG.mapUrl}?baseUrl=${window.URL_CONFIG.baseUrl}&appCode=${window.URL_CONFIG.appCode}`,
      iframe: null,
      isone: true,
      loaded: false,
      controllerLoaded: false,
      pageConfig: [],
      rowHeight: 0,
      state: {}
    };
  },
  computed: {
    viewPageId () {
      return this.$store.state.auth.viewPageId;
    }
  },
  created () {
    this.param = {
      test: ['this is params'],
    };
    //map
    this.$connector.onState(this,(state) => {
      data
    })
  },
  async mounted () {
    this.param = {
      test: ['this is params'],
    };
    this.isone = false;
    this.rowHeight = document.getElementById('GridContainer').clientHeight / 3 - 14;
  },

  watch: {
    viewPageId: {
      immediate: true,
      handler (val) {
        val && this.getPageConfig();
      }
    },
    boxshow: {
      handler (val) {
        const wrapper = document.getElementById('MapWrapper').parentNode;
        if (val) {
          wrapper.style.transform = originalStyle.transform;
          wrapper.style.width = originalStyle.width;
          wrapper.style.height = originalStyle.height;
        } else {
          originalStyle.transform = wrapper.style.transform;
          originalStyle.width = wrapper.style.width;
          originalStyle.height = wrapper.style.height;
          wrapper.style.transform = 'none';
          wrapper.style.width = '100%';
          wrapper.style.height = '100%';
          wrapper.style.zIndex = '2';
        }
        if (this.isone) {
          setTimeout(() => {
            this.setIframe();
          },1000);
        } else {
          this.setIframe();
        }
      },
    },
  },
  methods: {
    callMap ({ excutor,param }) {
      this.$connector.sendCallback(this.microAppCode,excutor,param);
    },
    async getPageConfig () {
      try {
        const loading = this.$loading({
          text: "页面加载中...",
          background: 'rgba(0,0,0,0.7)'
        })
        const { code,data } = await getPageConfig({
          pageId: this.viewPageId
        });
        loading.close();
        if (code === 200) {
          this.loaded = true;
          setTimeout(() => {
            this.pageConfig = data;
          },500);
        }
      } catch (err) {
        console.log(err);
      }
    },
    setIframe () {
      this.iframe = document.getElementById('mapiframe');
      if (this.iframe) {
        this.iframe.contentWindow.postMessage(
          { fl: !this.boxshow,type: 'show' },
          this.mapurl
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  position: relative;

  .content-inner {
    width: 100%;
    height: 100%;

    .vue-grid-item {
      background-color: $--main-color1;
      // box-shadow: 3px 3px 5px #7f7f7f;
      border: 1px solid rgba(30, 140, 242, 0.3);
      overflow: hidden;
      padding: 10px 12px;

      .component-wrapper {
        height: 100%;
        width: 100%;
        background-color: #fff;
        overflow: hidden;

        iframe {
          width: 100%;
          height: 100%;
        }
      }

      .map-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        transition: all 0.2s;
        // box-shadow: 3px 3px 5px rgb(127, 127, 127);

        #mapiframe {
          width: 100%;
          height: 100%;
        }

        i {
          font-size: 30px;
          position: absolute;
          bottom: 100px;
          right: 20px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>
