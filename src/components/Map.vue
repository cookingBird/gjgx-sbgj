<template>
<div class="map-container">
  <gislife-map
    v-if="appConfig.baseUrl"
    v-on="$listeners"
    ref="map"
    :appcode="appConfig.appCode"
    :baseUrl="appConfig.baseUrl"
    :requestHeader="requestHeader"
    @onLoad="handleMapLoad"
    @onMapClick="handleMapClick"
  />
</div>
</template>

<script>
  import mapLifecycle from '@/mixins/mapLifecycle';

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
  }

  export default {
    mixins: [mapLifecycle()],
    data () {
      return {
        requestHeader: {
          token: sessionStorage.token
        },
        appConfig: window.URL_CONFIG
      }
    },
    created () {
      this.renderMarkLayer = this.renderMarkerByType;
    },
    methods: {
      handleMapClick (e) {
        console.log(e);
      },
      handleMapLoad () {
        this.$emit('onLoad');
        this.setMapLoaded();
      },
      /**
       * @description 删除管线图层
       * 
       * **/
      removePipeLayer () {
        const { map } = this.$refs['map'].map;
        map.getLayer(PIPE_LAYER_ID) && this.removeLayer(PIPE_LAYER_ID);
        map.getLayer('pipe-name') && this.removeLayer('pipe-name');
      },
      /**
       * @description 删除图层
       * @param {layerId}
       * **/
      removeLayer (layerId) {
        const { map } = this.$refs['map'].map;
        layerId && map.removeLayer(layerId);
      },
      /**
       * @description 线定位
       * @param {wkt}  
       * **/
      locationByLineString (wkt) {
        const { map } = this.$refs['map'].map;
        const geometry = window.Terraformer.WKT.parse(wkt);
        const bbox = turf.bbox(geometry);
        map.fitBounds(bbox,{
          duration: 1 * 1000,
          padding: { top: 10,bottom: 25,left: 15,right: 5 },
        })
      },
      /**
        * @description 生成管线source
        * @param {pipes} 管线集合
        * **/
      createPipeSource (pipes,id) {
        const { map } = this.$refs['map'].map;
        let source = map.getSource(id);
        if (!source) {
          map.addSource(id,{
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': []
            }
          });
          source = map.getSource(id);
        }
        let data = {
          'type': 'FeatureCollection',
          'features': []
        }
        pipes.forEach((pipe) => {
          const { name,wkt } = pipe;
          //线数据
          const geometry = window.Terraformer.WKT.parse(wkt);
          data.features.push({
            type: 'Fetaure',
            geometry,
            properties: {
              ...pipe
            }
          })
          //中心点数据
          const centerGeometry = turf.center(geometry);
          data.features.push({
            type: 'Fetaure',
            geometry: centerGeometry.geometry,
            properties: {
              name,
            },
          })
        })
        source.setData(data);
        return source.id;
      },
      /**
       * @description 生成点数据源
       * @param {points} 点集合
       * **/
      createPointSource (points,id) {
        const { map } = this.$refs['map'].map;
        let source = map.getSource(id);
        if (!source) {
          map.addSource(id,{
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': []
            }
          })
          source = map.getSource(id);
        }
        let data = {
          'type': 'FeatureCollection',
          'features': []
        }
        points.forEach(point => {
          const { wkt } = point;
          const geometry = window.Terraformer.WKT.parse(wkt);
          data.features.push({
            type: 'Fetaure',
            geometry,
            properties: {
              ...point
            },
          })
        })
        source.setData(data);
        return source.id;
      },
      /**
       * @description 管道渲染
       * @param {pipes} 管线集合
       * **/
      pipeRender (pipes) {
        const { map } = this.$refs['map'].map;
        const sourceId = this.createPipeSource(pipes,PIPE_LAYER_ID);
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
          filter: ['==','$type','LineString']
        })
        //管线名称图层
        !map.getLayer('pipe-name') && map.addLayer({
          id: 'pipe-name',
          type: 'symbol',
          source: sourceId,
          layout: {
            'text-rotate': 360,
            'text-letter-spacing': 0,
            'text-field': ['get','name'],
            'text-rotation-alignment': 'viewport',
            'text-size': 14,
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'symbol-placement': 'point',
            'text-font': ['literal',[' bold  arial,sans-serif']],
          },
          paint: {
            'text-color': '#fff'
          },
          filter: ['==','$type','Point'],
          minzoom: 12,
          maxzoom: 0
        })
      },
      /**
       * @description 删除管线影响半径
       * **/
      pipeRadiusRemove (id = 'pipe-radius') {
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
      pipeRadiusRender (wkt) {
        const { map } = this.$refs['map'].map;
        const id = 'pipe-radius';
        const geometry = window.Terraformer.WKT.parse(wkt);
        map.addLayer({
          id,
          type: 'fill',
          source: {
            type: 'geojson',
            data: {
              'type': 'Feature',
              'geometry': geometry
            }
          },
          paint: {
            'fill-color': '#ffff00',
            'fill-opacity': 0.3,
            'fill-outline-color': '#ffff00'
          }
        });
        return {
          update: (wkt) => {
            this.pipeRadiusRemove();
            this.pipeRadiusRender(wkt)
          },
          remove: () => {
            map.removeLayer(id)
          }
        }
      },
      /**
       * @description 管道分段节点
       * @param {wkts} 节点集合
       * **/
      pipeSectionPointRender (wkts) {
        const { map } = this.$refs['map'].map;
        const img = require('@/assets/images/分段点位.png');
        const id = 'section-point';
        const sourceId = this.createPointSource(wkts.map(wkt => {
          return {
            wkt
          }
        }),id);
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
              "icon-offset": [0,-40],
            },
            minzoom: 12,
            maxzoom: 0
          })
        })
        return {
          update: (wkts) => {
            this.createPointSource(wkts.map(wkt => ({ wkt })),id);
          }
        }
      },
      /**
       * @description 加载图片
       * @param {img} 
       * **/
      async loadImage (img) {
        const { map } = this.$refs['map'].map;
        return new Promise((resolve,reject) => {
          if (map.hasImage(img)) {
            resolve();
          } else {
            map.loadImage(img,(err,data) => {
              if (err) {
                reject();
              } else {
                map.addImage(img,data);
                resolve();
              }
            })
          }
        })
      },
      /**
       * @description 场站、阀室
       * @param {stations} 场站集合
       * **/
      stationRender (stations) {
        const id = 'station';
        const { map } = this.$refs['map'].map;
        const sourceId = this.createPointSource(stations,id);
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
              "icon-image": ['get','_image'],
              "icon-anchor": "center",
              "icon-size": 0.3,
              "symbol-placement": "point",
              "text-rotation-alignment": "viewport",
              "text-field": ['get','name'],
              "text-size": 10,
              "text-ignore-placement": false,
              "icon-allow-overlap": false,
              "text-offset": [0,2],
            },
            paint: {
              "text-color": "#fff",
            },
            minzoom: 12,
            maxzoom: 0
          })
        })
      },
      /**
       * @description 人居、特定场所、易燃易爆场所
       * @param {data} 数据集合
       * @param {type} 1.人居 2.特定场所 3.易燃易爆场所
       * **/

      renderMarkerByType (data,type) {
        let layer;
        const { map } = this.$refs['map'].map;
        if (!this.MARKER_MAP) {
          this.MARKER_MAP = {
            1: require('@/assets/images/人居.png'),
            population: require('@/assets/images/人居.png'),
            2: require('@/assets/images/特定场所.png'),
            specific: require('@/assets/images/特定场所.png'),
            3: require('@/assets/images/易燃易爆.png'),
            flammable: require('@/assets/images/易燃易爆.png'),
          }
        }
        const MARKER_MAP = this.MARKER_MAP;
        const id = 'marker-' + type
        const img = MARKER_MAP[type];
        const sourceId = this.createPointSource(data,id);
        this.loadImage(img).then(_ => {
          !map.getLayer(id) && (layer = map.addLayer({
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
          }))

          //人居添加hover popup
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          })
          map.on('mouseenter',id,(e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = `<span>${e.features[0].properties.name || '空'}</span>`;
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
          })

          map.on('mouseleave',id,() => {
            map.getCanvas().style.cursor = '';
            popup.remove();
          })
        })
        return {
          toggleVisibility (val) {
            if (val) {
              layer && map.setLayoutProperty(id,'visibility','visible')
            } else {
              layer && map.setLayoutProperty(id,'visibility','none')
            }
          },
          update (data) {
            this.createPointSource(data,id)
            return layer
          },
          destory () {
            map.removeLayer(id)
          },
          layer
        }
      },
      /**
       * @description 高后果区等级
       * @param {data} 高后果区数据集合
       * **/
      sectionLevelRender (
        data,
        levelKey = 'regionLevel',
        colorMap = [
          '0','#00B725',
          '1','#F7A830',
          '2','#FE7E0E',
          '3','#EE5D4F',
          'yellow'
        ]
      ) {
        const { map } = this.$refs['map'].map;
        const id = 'section-level';
        const source = this.createPipeSource(data,id);
        !map.getLayer(id) && map.addLayer({
          id,
          type: 'line',
          source: source,
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            "line-color": [
              "match",
              ["get",levelKey],
              ...colorMap
            ],

            'line-width': 5
          },
          filter: ['==','$type','LineString']
        },'pipe-name')
        console.log('sectionLevelRender----------',data);
      },
      resize () {
        this.$refs['map'].resize();
      }
    }
  }
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
