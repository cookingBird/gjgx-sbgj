<template>
<div class="map-container">
  <gislife-map
    v-if="appConfig.baseUrl"
    v-on="$listeners"
    ref="map"
    :appcode="appConfig.mapConfig.appCode"
    :baseUrl="appConfig.mapConfig.baseUrl"
    :requestHeader="requestHeader"
    @onLoad="handleMapLoad"
    @onMapClick="handleMapClick"
  />
  <slot v-if="mapLoaded"></slot>
</div>
</template>

<script>
  import mapLifecycle from '@/mixins/mapLifecycleBlock';
  import pipeInfoPop from '@/components/InfoPop.vue';
  import { compilePop } from "@/utils/compile";

  const SECTION_LAYER_ID = 'section-level'
  const PIPE_LAYER_ID = 'pipe-line';
  const STATION_IMG_MAP = {
    1: require('@/assets/images/处理厂.png'),
    2: require('@/assets/images/净化厂.png'),
    4: require('@/assets/images/集注站.png'),
    8: require('@/assets/images/集气站.png'),
    9: require('@/assets/images/脱水站.png'),
    10: require('@/assets/images/阀室.png'),
    21: require('@/assets/images/输气站.png'),
    22: require('@/assets/images/配气站.png'),
    24: require('@/assets/images/采气站.png'),
    25: require('@/assets/images/输配气站.png'),
    26: require('@/assets/images/T节点.png'),
    99: require('@/assets/images/其他场站.png'),
  };

  export default {
    components: { pipeInfoPop },
    mixins: [mapLifecycle(() => this.$refs['map'].map)],
    props: ['pop', 'InfoCallback', 'popFilter'],
    data() {
      return {
        requestHeader: {
          token: sessionStorage.token
        },
        appConfig: window.URL_CONFIG,
        mapLoaded: false,
        infoVisible: false,
        popShow: this.pop,
        popFilterCb: this.popFilter,
        popInfoCallback: this.InfoCallback,
      };
    },
    computed: {
      setPopShow() {
        return (val, filter, infoCb) => {
          this.popShow = val;
          this.popFilterCb = filter;
          this.popInfoCallback = infoCb
        }
      },
      mapboxInstance() {
        return this.$refs['map']?.map?.map
      }
    },
    created() {
      this.renderMarkLayer = this.renderMarkerByType;
    },
    methods: {
      handleMapClick(e) {
        const { popFilterCb, popInfoCallback } = this;
        if (this.popShow) {
          if (popFilterCb?.(e)) {
            this.__popClose?.()
            this.__popClose = this.openPop(e, popInfoCallback)
          }
        }
      },
      /**@description 打开气泡框 */
      openPop(e, popInfoCallback, cancelCb, map = this.mapboxInstance) {
        function handler(e, infoCb, map) {
          const node = compilePop({
            info: (infoCb && infoCb(e.infos)) || e.infos,
            onClose: closeHandler
          });
          const pop = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            closeOnMove: false,
            anchor: 'bottom',
            // offset: 120,
            className: 'result-pop',
            maxWidth: '530px',
          });
          pop.setDOMContent(node).setLngLat(e.position).addTo(map)
          function closeHandler() {
            pop.remove();
            cancelCb?.()
          };
          return closeHandler
        };
        return handler(e, popInfoCallback, map)
      },
      /**@description 地图加载完成(所有图层服务) */
      handleMapLoad() {
        this.$emit('onLoad');
        this.setMapLoaded();
        this.mapLoaded = true;
      },
      /**
       * @description 删除管线图层
       **/
      removePipeLayer() {
        const { map } = this.$refs['map'].map;
        map.getLayer(PIPE_LAYER_ID) && this.removeLayer(PIPE_LAYER_ID);
        map.getLayer('pipe-name') && this.removeLayer('pipe-name');
      },
      /**
       * @description 删除图层
       * @param {layerId}
       * **/
      removeLayer(layerId) {
        const { map } = this.$refs['map'].map;
        layerId && map.removeLayer(layerId);
      },
      /**
       * @description 线定位
       * @param {wkt}
       * **/
      locationByLineString(wkt, options = {}, centerCb) {
        const { map } = this.$refs['map'].map;
        const geometry = window.Terraformer.WKT.parse(wkt);
        console.log("locationByLineString---------", geometry);
        const bbox = turf.bbox(geometry);
        map.fitBounds(bbox, {
          duration: 1 * 1000,
          padding: Object.assign({ top: 10, bottom: 25, left: 15, right: 5 }, options.padding),
        });
        if (centerCb) {
          centerCb(geometry.coordinates[Math.floor(geometry.coordinates.length / 2)])
        }
      },
      /**
       * @param {array} infoArray
       * @param {function} geometryCb
       * @returns {geojson} geojson
       */
      createFeatureCollection(infoArray, geometryCb = ({ wkt }) => Terraformer.WKT.parse(wkt)) {
        const collection = {
          type: 'FeatureCollection',
          features: []
        };
        try {
          collection.features = infoArray
            .filter(info => info.wkt)
            .map((info) => ({
              type: 'Feature',
              geometry: geometryCb(info),
              properties: info
            }))
        } catch (error) {
          console.error(error)
        }
        return collection;
      },
      /**
        * @description 生成管线source
        * @param {pipes} 管线集合
        * **/
      createPipeSource(pipes, id) {
        const { map } = this.$refs['map'].map;
        let source = map.getSource(id);
        if (!source) {
          map.addSource(id, {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [],
            }
          });
          source = map.getSource(id);
        }
        //* 新增Geojson或更新Geojson
        const data = this.createFeatureCollection(pipes)
        source.setData(data);
        return source.id;
      },
      /**
       * @description 生成点数据源
       * @param {points} 点集合
       * **/
      createPointSource(points, id) {
        console.warn("createPointSource-----------------", points);
        const { map } = this.$refs['map'].map;
        let source = map.getSource(id);
        if (!source) {
          map.addSource(id, {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': []
            }
          });
          source = map.getSource(id);
        }
        //* 新增Geojson或更新Geojson
        const data = this.createFeatureCollection(points)
        source.setData(data);
        return source.id;
      },
      /**
       * @description 管道渲染
       * @param {pipes} 管线集合
       * **/
      pipeRender(pipes, options = {}) {
        const { map } = this.$refs['map'].map;
        const layerId = 'pipe-name';
        const sourceId = this.createPipeSource(pipes, PIPE_LAYER_ID);
        this.removePipeLayer();
        //管线图层
        !map.getLayer(PIPE_LAYER_ID) && map.addLayer({
          id: PIPE_LAYER_ID,
          type: 'line',
          source: sourceId,
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': "yellow",
            'line-width': 5
          },
          filter: ['==', '$type', 'LineString']
        });
        //管线名称图层
        !map.getLayer(layerId) && map.addLayer({
          id: layerId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'text-rotate': 360,
            'text-letter-spacing': 0,
            'text-field': ['get', 'name'],
            'text-rotation-alignment': 'viewport',
            'text-size': 14,
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'symbol-placement': 'point',
            'text-font': ['literal', [' bold  arial,sans-serif']],
          },
          paint: {
            'text-color': '#fff'
          },
          filter: ['==', '$type', 'Point'],
          minzoom: 12,
          maxzoom: 0
        });
        return {
          toggleVisibility(val) {
            if (val) {
              map.setLayoutProperty(PIPE_LAYER_ID, 'visibility', 'visible');
            } else {
              map.setLayoutProperty(PIPE_LAYER_ID, 'visibility', 'none');
            }
          },
          move2Top() {
            map.moveLayer(PIPE_LAYER_ID);
          }
        };
      },
      /**
       * @description 删除管线影响半径
       * **/
      pipeRadiusRemove(id = 'pipe-radius') {
        const { map } = this.$refs['map'].map;
        try {
          if (map.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
          }
        } catch (e) { }
      },
      /**
       * @description 渲染管线影响半径
       * @param {wkt} 影响半径wkt
       * **/
      pipeRadiusRender(wkt) {
        if (!wkt) return;
        const { map } = this.$refs['map'].map;
        const id = 'pipe-radius';
        let sourceId;
        if (wkt.wkt) {
          sourceId = this.createPipeSource([wkt], id);
        }
        if (Array.isArray(wkt)) {
          sourceId = this.createPipeSource(wkt, id);
        }

        !map.getLayer(id) && map.addLayer({
          id,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#ffff00',
            'fill-opacity': 0.3,
            'fill-outline-color': '#ffff00'
          }
        });
        return {
          update: (wkt) => {
            this.pipeRadiusRemove(id);
            this.pipeRadiusRender(wkt);
          },
          remove: () => {
            map.removeLayer(id);
          }
        };
      },
      /**
       * @description 管道分段节点
       * @param {wkts} 节点集合
       * **/
      pipeSectionPointRender(wkts) {
        const { map } = this.$refs['map'].map;
        const img = require('@/assets/images/分段点位.png');
        const id = 'section-point';
        /**
         * wkts = [ {wkt},... ]
         */
        const sourceId = this.createPointSource(wkts, id);
        this.loadImage(img).then(_ => {
          !map.getLayer(id) && map.addLayer({
            id,
            type: 'symbol',
            source: sourceId,
            layout: {
              "icon-image": img,
              "icon-anchor": "center",
              "icon-size": 0.2,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "symbol-placement": "point",
              "text-rotation-alignment": "viewport",
              "icon-offset": [0, -40],
            },
            minzoom: 12,
            maxzoom: 0
          });
        });
        return {
          update: (wkts) => {
            this.createPointSource(wkts.map(wkt => ({ wkt })), id);
          }
        };
      },
      /**
       * @description 加载图片
       * @param {img}
       * **/
      async loadImage(img) {
        await this.mapLifecycle.loaded.ready();
        const { map } = this.$refs['map'].map;
        return new Promise((resolve, reject) => {
          if (map.hasImage(img)) {
            resolve();
          } else {
            map.loadImage(img, (err, data) => {
              if (err) {
                reject();
              } else {
                map.addImage(img, data);
                resolve();
              }
            });
          }
        });
      },
      /**
       * @description 场站、阀室
       * @param {stations} 场站集合
       * **/
      stationRender(stations) {
        const id = 'station';
        const { map } = this.$refs['map'].map;
        const sourceId = this.createPointSource(stations, id);
        Promise.all(stations.map((station) => {
          const { type } = station;
          const image = STATION_IMG_MAP[type] || STATION_IMG_MAP[99];
          station._image = image;
          return this.loadImage(image);
        })).then(() => {
          !map.getLayer(id) && map.addLayer({
            id,
            type: 'symbol',
            source: sourceId,
            layout: {
              "icon-image": ['get', '_image'],
              "icon-anchor": "center",
              "icon-size": 0.3,
              "symbol-placement": "point",
              "text-rotation-alignment": "viewport",
              "text-field": ['get', 'name'],
              "text-size": 10,
              "text-ignore-placement": false,
              "icon-allow-overlap": false,
              "text-offset": [0, 2],
            },
            paint: {
              "text-color": "#fff",
            },
            minzoom: 12,
            maxzoom: 0
          });
        });
      },
      /**
       * @description 人居、特定场所、易燃易爆场所
       * @param {data} 数据集合
       * @param {type} 1.人居 2.特定场所 3.易燃易爆场所
       * **/

      renderMarkerByType(data, type) {
        const { map } = this.$refs['map'].map;
        if (!this.MARKER_MAP) {
          this.MARKER_MAP = {
            1: require('@/assets/images/人居.png'),
            population: require('@/assets/images/人居.png'),
            2: require('@/assets/images/特定场所.png'),
            specific: require('@/assets/images/特定场所.png'),
            3: require('@/assets/images/易燃易爆.png'),
            flammable: require('@/assets/images/易燃易爆.png'),
          };
        }
        const MARKER_MAP = this.MARKER_MAP;
        const id = 'marker-' + type;
        const img = MARKER_MAP[type];
        const sourceId = this.createPointSource(data, id);
        this.loadImage(img).then(_ => {
          !map.getLayer(id) && (map.addLayer({
            id,
            type: 'symbol',
            source: sourceId,
            layout: {
              "icon-image": img,
              "icon-anchor": "center",
              "icon-size": 0.3,
              "symbol-placement": "point",
              "icon-allow-overlap": false,
            },
            minzoom: 12,
            maxzoom: 0
          }));

          //人居添加hover popup
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });
          map.on('mouseenter', id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `<span>${ e.features[0].properties.name || '空' }</span>`;
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
          });

          map.on('mouseleave', id, () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
          });
        });
        return {
          toggleVisibility(val) {
            if (val) {
              map.setLayoutProperty(id, 'visibility', 'visible');
            } else {
              map.setLayoutProperty(id, 'visibility', 'none');
            }
          },
          update(data) {
            this.createPointSource(data, id);
            return layer;
          },
          destory() {
            map.removeLayer(id);
          },
          id
        };
      },
      /**
       * @description 高后果区等级
       * @param {data} 高后果区数据集合
       * **/
      sectionLevelRender(data, levelKey = 'regionLevel', id = 'section-level', colorMap = [
        '0', '#00B725',
        '1', '#F7A830',
        '2', '#FE7E0E',
        '3', '#EE5D4F',
        'yellow'
      ]) {
        console.warn('sectionLevelRender-----------------', data, levelKey);
        const { map } = this.$refs['map'].map;
        const sourceId = this.createPipeSource(data, id);
        !map.getLayer(id) && map.addLayer({
          id,
          type: 'line',
          source: sourceId,
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            "line-color": [
              "match",
              ["get", levelKey],
              ...colorMap
            ],

            'line-width': 5
          },
          filter: ['==', '$type', 'LineString']
        });
        return {
          id,
          toggleVisibility(val) {
            if (val) {
              map && map.setLayoutProperty(id, 'visibility', 'visible');
            } else {
              map && map.setLayoutProperty(id, 'visibility', 'none');
            }
          },
          move2Top() {
            map.moveLayer(id);
          }
        };
      },
      resize() {
        this.$refs['map'].resize();
      },
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .mapboxgl-popup {
    max-width: 200px;
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    top: -20px;
  }

  .map-container {
    width: 100%;
    height: 100%;

    ::v-deep .map-type-controller {
      display: none;
    }
  }
</style>
