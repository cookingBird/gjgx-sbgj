/**
 * @title  二维gis库1.0
 * @author 邬袁凯
 * @time 2020-1
 */
import MvtLayer from "./Source/MvtLayer.js";
import GeoLayer from "./Source/GeoLayer.js";
import Pop from "./Source/Pop.js";
import Measure from "./Source/Measure.js";
import Plot from "./Source/Plot.js";

function Map(containerid, baseimage, opt) {
  if (!containerid) {
    return;
  }
  let options = opt || {};
  let center = options.center || [104.07, 30.67]; //默认中心点
  let zoom = options.zoom || 7; //默认层级
  let maxzoom = options.maxzoom * 1 || 24;
  let minzoom = options.minzoom * 1 || 0;
  let iportalkey = options.iportal || "";
  let url = options.url;
  let navigation = options.navigation || {
    show: true,
    location: "top-right",
  };
  let dbzoom;
  let scrollzoom;
  if (options.dbzoom == false) {
    dbzoom = false;
  } else {
    dbzoom = true;
  }
  if (options.scrollzoom == false) {
    scrollzoom = false;
  } else {
    scrollzoom = true;
  }
  let mapType = baseimage || "mapWord-img";
  let maptoken = null;
  this.mvtLayers = [];
  this.pops = [];
  this.imageryLayers = [];
  this.geometries = [];
  this.dynamicPolylines = [];
  this.trailPolylines = [];
  this.dynamicPoints = [];
  this.buffers = [];
  this.echartslayer = null;
  this.zoomEvent = null;
  this.clickEvent = null;
  this.rightClickEvent = null;
  this.moveEvent = null;
  this.cameraEvent = null;
  this.GeoclickEvent = null;
  this.Geoselectlayer = null;
  let style = {};
  switch (mapType) {
    case "designRest":
      style = {
        //天地图影像
        version: 8,
        sources: {
          raster_tiles_rest: {
            type: "raster",
            tiles: [url],
            tileSize: 256,
          },
        },
        layers: [{
          id: "tdt-img-rest",
          type: "raster",
          source: "raster_tiles_rest",
        }, ],
      };
      break;
    case "mapWord-img":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      style = {
        //天地图影像
        version: 8,
        sources: {
          raster_tiles_img: {
            type: "raster",
            tiles: [
              `http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
          "raster-cia": {
            type: "raster",
            tiles: [
              `http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
        },
        layers: [{
            id: "tdt-img-tiles",
            type: "raster",
            source: "raster_tiles_img",
          },
          {
            id: "tdt-cva-tiles",
            type: "raster",
            source: "raster-cia",
            renderWorldCopies: false,
            isConstrain: true,
          },
        ],
      };
      break;
    case "mapWord-vec":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      style = {
        //天地图矢量注记
        version: 8,
        sources: {
          "raster-tiles-vec": {
            type: "raster",
            tiles: [
              `http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
          "raster-cva": {
            type: "raster",
            tiles: [
              `http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
        },
        layers: [{
            id: "tdt-vec-tiles",
            type: "raster",
            source: "raster-tiles-vec",
          },
          {
            id: "tdt-cva-tiles",
            type: "raster",
            source: "raster-cva",
          },
        ],
      };
      break;

    case "mapWord-ter":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      style = {
        //天地图地形晕渲
        version: 8,
        sources: {
          "raster-tiles-ter": {
            type: "raster",
            tiles: [
              `http://t7.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
          "raster-cta": {
            type: "raster",
            tiles: [
              `http://t0.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
        },
        layers: [{
            id: "tdt-ter-tiles",
            type: "raster",
            source: "raster-tiles-ter",
          },
          {
            id: "tdt-cta-tiles",
            type: "raster",
            source: "raster-cta",
          },
        ],
      };
      break;
    case "A4":
      style = {
        //A4服务
        version: 8,
        sources: {
          A4: {
            type: "raster",
            tiles: [url],
            tileSize: 256,
          },
        },
        layers: [{
          id: "A4-tiles",
          type: "raster",
          source: "A4",
        }, ],
      };
      break;

    case "scmapWord-img":
      maptoken =
        options.token ||
        "4SVVnPw609KwqSUir46UEKZpjSaCipFATjWgwvPtZVvPznuqeNhHIx3aIhQsi4Nx";
      style = {
        //天地图影像四川
        version: 8,
        sources: {
          "raster-tiles-scimg": {
            type: "raster",
            tiles: [
              `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudom_sc/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=四川省内影像地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
          "raster-tiles-sccta": {
            type: "raster",
            tiles: [
              `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudom_scann/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=四川省注记地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
        },
        layers: [{
            id: "tdt-scimg-tiles",
            type: "raster",
            source: "raster-tiles-scimg",
          },
          {
            id: "tdt-sccta-tiles",
            type: "raster",
            source: "raster-tiles-sccta",
          },
        ],
      };
      break;
    case "scmapWord-vec":
      maptoken =
        options.token ||
        "4SVVnPw609KwqSUir46UEKZpjSaCipFATjWgwvPtZVvPznuqeNhHIx3aIhQsi4Nx";
      style = {
        //天地图矢量四川
        version: 8,
        sources: {
          "raster-tiles-scvec": {
            type: "raster",
            tiles: [
              `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudlg_sc/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=聚合天地图瓦片地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
            ],
            tileSize: 256,
          },
        },
        layers: [{
          id: "tdt-scvec-tiles",
          type: "raster",
          source: "raster-tiles-scvec",
        }, ],
      };
      break;
  }
  style.glyphs = "/data/fonts/test/{range}.pbf";
  this.map = new mapboxgl.Map({
    container: containerid, // container id
    style: style,
    attributionControl: false,
    zoom: zoom,
    center: center,
    crs: new mapboxgl.CRS("EPSG:4326", [-180, -90, 180, 90]),
    minZoom: minzoom,
    maxZoom: maxzoom,
    scrollZoom: scrollzoom,
    doubleClickZoom: dbzoom,
    preserveDrawingBuffer: true,
    trackResize: true,
    transformRequest: (url, resourceType) => {
      //解决iportal key 加载问题
      /* if (url.indexOf('portalproxy') != -1) {
				if (url.indexOf('&') != -1) {
					return {
						url: url + `&key=${iportalkey}`
					}
				} else {
					return {
						url: url + `?key=${iportalkey}`
					}
				}
			} */
      //以下代码为解决添加超图转发天地图的wmts服务不出图的问题
      //if (url.match(/\TILEMATRIX=\d*/)) {
      //var z = parseInt(url.match(/\TILEMATRIX=\d*/)[0].split('=')[1]) - 1
      //var ss = url.replace(url.match(/\TILEMATRIX=\d*/), 'TILEMATRIX=' + z)
      //return {
      //url: ss
      //}
      //}
    },
  });
  if (navigation.show == true) {
    this.map.addControl(new mapboxgl.NavigationControl(), navigation.location); //加载导航
  }
}
Map.prototype.loadImage = function (url, id, callback) {
  if (this.map.hasImage(id)) {
    return;
  }
  this.map.loadImage(url, (error, image) => {
    if (error) throw error;
    this.map.addImage(id, image);
    if (callback) {
      callback();
    }
  });
};
/* 地图重绘*/
Map.prototype.resize = function () {
  this.map.resize();
};
/* 地图出图*/
Map.prototype.outPutPicture = function (width, height) {
  var url = this.map.getCanvas().toDataURL();
  download(url, width, height);

  function convertImageToCanvas(image, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width || document.body.clientWidth;
    canvas.height = height || document.body.clientHeight;
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function download(base64data, width, height) {
    var image = new Image();
    image.src = base64data;
    image.onload = function () {
      var canvas = convertImageToCanvas(image, width, height);
      var url = canvas.toDataURL("image/jpeg");
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = new Date().getTime() + ".jpg"; // 指定下载图片的名称
      a.href = url;
      a.dispatchEvent(event); // 触发超链接的点击事件
    };
  }
};
/* 2000转百度*/
Map.prototype.convert2000ToBaidu = function (arr) {
  var position = window.coordtransform.wgs84togcj02(arr[0], arr[1]);
  return window.coordtransform.gcj02tobd09(position[0], position[1]);
};
/* 百度转2000*/
Map.prototype.convertBaiduTo2000 = function (arr) {
  var position = window.coordtransform.bd09togcj02(arr[0], arr[1]);
  return window.coordtransform.gcj02towgs84(position[0], position[1]);
};
/* 2000转火星*/
Map.prototype.convert2000ToGcj02 = function (arr) {
  return window.coordtransform.wgs84togcj02(arr[0], arr[1]);
};
/* 火星转2000*/
Map.prototype.convertGcj02To2000 = function (arr) {
  return window.coordtransform.gcj02towgs84(arr[0], arr[1]);
};
/* 初始化测量对象*/
Map.prototype.initMeasure = function () {
  var measure = new Measure(this.map);
  return measure;
};
/* 初始化标绘对象*/
Map.prototype.initPlot = function () {
  var map = this.map;
  var plot = new Plot(this.map);
  return plot;
};
/* 创建缓冲区对象*/
Map.prototype.addBuffer = function (wkt, id, bufferrad, buffercolor) {
  if (!wkt || !id || !bufferrad) {
    return;
  }
  var rad = bufferrad / 1000;
  var color = buffercolor || "#ff0000";
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var buffered = turf.buffer(geoJson, rad, {
    units: "kilometers",
  });
  if (buffered) {
    this.map.addLayer({
      id: id,
      type: "fill",
      source: {
        type: "geojson",
        data: buffered,
      },
      paint: {
        "fill-color": color,
        "fill-opacity": 0.4,
      },
    });
    this.buffers.push(id);
  }
};
/* 移除缓冲区根据id */
Map.prototype.removeBufferById = function (id) {
  for (var j = 0; j < this.buffers.length; j++) {
    if (this.buffers[j] == id) {
      this.map.removeLayer(id);
      this.map.removeSource(id);
      var int = this.buffers.indexOf(this.buffers[j]);
      this.buffers.splice(int, 1);
      break;
    }
  }
};
/* 移除所有缓冲区 */
Map.prototype.removeAllBuffers = function () {
  if (this.buffers.length > 0) {
    for (var j = 0; j < this.buffers.length; j++) {
      this.map.removeLayer(this.buffers[j]);
      this.map.removeSource(this.buffers[j]);
    }
    this.buffers = [];
  }
};
/* 添加动态扩散点 */
Map.prototype.addDynamicPoint = function (wkt, id, radcircle, color) {
  if (!wkt || !id) {
    return;
  }
  var map = this.map;
  var circlecolor = color || "#5555ff";
  var rad = radcircle || 50;
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var data = {
    type: "Feature",
    geometry: geoJson,
  };
  this.map.addLayer({
    id: id,
    type: "circle",
    source: {
      type: "geojson",
      data: data,
    },
    paint: {
      "circle-radius": 0,
      "circle-color": "rgba(255, 85, 0, 0.2)",
      "circle-stroke-color": circlecolor,
      "circle-stroke-width": 2,
    },
  });
  var dynamicpoly = new dynamicPoint(map, id, rad);
  dynamicpoly.play;
  this.dynamicPoints.push({
    point: dynamicpoly,
    id: id,
  });
};

function dynamicPoint(map, id, rad) {
  this.animation = null;
  var that = this;
  var startnumber = 0;
  this.play = animateLine();

  function animateLine() {
    if (startnumber >= rad) {
      startnumber = 0;
    }
    startnumber += 0.1;
    map.setPaintProperty(id, "circle-radius", startnumber);
    that.animation = requestAnimationFrame(animateLine);
  }
}
/* 移除扩散点根据id */
Map.prototype.removeDynamicPointById = function (id) {
  for (var j = 0; j < this.dynamicPoints.length; j++) {
    if (this.dynamicPoints[j].id == id) {
      var dynamic = this.dynamicPoints[j].point;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(id);
      this.map.removeSource(id);
      var int = this.dynamicPoints.indexOf(this.dynamicPoints[j]);
      this.dynamicPoints.splice(int, 1);
      break;
    }
  }
};
/* 移除扩散点 */
Map.prototype.removeAllDynamicPoints = function () {
  if (this.dynamicPoints.length > 0) {
    for (var j = 0; j < this.dynamicPoints.length; j++) {
      var dynamic = this.dynamicPoints[j].point;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(this.dynamicPoints[j].id);
      this.map.removeSource(this.dynamicPoints[j].id);
    }
    this.dynamicPoints = [];
  }
};
/* 添加流动线 */
Map.prototype.addTrailPolyline = function (wkt, id, color, isshowpolyline) {
  if (!id || !wkt) {
    return;
  }
  var map = this.map;
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var positions = [];
  var len = turf.length(geoJson, {
    units: "miles",
  });
  var steps = 500;
  for (var i = 0; i < len; i += len / steps) {
    var segment = turf.along(geoJson, i, {
      units: "miles",
    });
    if (segment) {
      positions.push(segment.geometry.coordinates);
    }
  }
  var trailLen = Math.ceil(positions.length / 5);
  var geoJsonBaseLine = {
    type: "LineString",
    coordinates: positions,
  };
  var geoJsonTrain = {
    type: "LineString",
    coordinates: [],
  };
  var linecolor = color || "#55ff00";
  var isshow = "visible";
  if (isshowpolyline == true) {
    isshow = "visible";
  } else if (isshowpolyline == false) {
    isshow = "none";
  }
  map.addLayer({
    id: id,
    type: "line",
    source: {
      type: "geojson",
      data: geoJsonTrain,
      lineMetrics: true,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 9,
      "line-gradient": [
        "interpolate",
        ["linear"],
        ["line-progress"],
        0,
        "rgba(85, 85, 255, 0.0)",
        0.1,
        "rgba(85, 85, 255, 0.1)",
        0.3,
        "rgba(85, 85, 255, 0.3)",
        0.5,
        "rgba(85, 85, 255, 0.5)",
        0.7,
        "rgba(85, 85, 255, 0.7)",
        1,
        "rgba(85, 85, 255, 0.9)",
      ],
    },
    metadata: {
      zIndex: 0
    }
  });
  map.addLayer({
    id: id + "base",
    type: "line",
    source: {
      type: "geojson",
      data: geoJsonBaseLine,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: isshow,
    },
    paint: {
      "line-color": linecolor,
      "line-width": 1,
      "line-opacity": 0.9,
    },
  });
  var dynamicpoly = new trailPolyline(
    positions,
    geoJsonTrain,
    map,
    id,
    trailLen
  );
  dynamicpoly.play();
  this.trailPolylines.push({
    polyline: dynamicpoly,
    id: id,
  });
};

function trailPolyline(positions, geoJsonTrain, map, id, trailLen) {
  this.animation = null;
  var that = this;
  this.play = animateLine;
  var startnumber = 0;

  function animateLine() {
    if (startnumber == positions.length - 1) {
      startnumber = 0;
      geoJsonTrain.coordinates = [];
    }
    if (startnumber < trailLen) {
      geoJsonTrain.coordinates.push(positions[startnumber]);
    } else {
      geoJsonTrain.coordinates.splice(0, 1);
      geoJsonTrain.coordinates.push(positions[startnumber]);
    }
    startnumber++;
    map.getSource(id).setData(geoJsonTrain);
    that.animation = requestAnimationFrame(animateLine);
  }
}
/* 移除流动线 */
Map.prototype.removeTrailPolylineById = function (id) {
  for (var j = 0; j < this.trailPolylines.length; j++) {
    if (this.trailPolylines[j].id == id) {
      var dynamic = this.trailPolylines[j].polyline;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(id);
      this.map.removeLayer(id + "base");
      this.map.removeSource(id + "base");
      this.map.removeSource(id);
      var int = this.trailPolylines.indexOf(this.trailPolylines[j]);
      this.trailPolylines.splice(int, 1);
      break;
    }
  }
};
/* 移除所有流动线 */
Map.prototype.removeAllTrailPolylines = function () {
  if (this.trailPolylines.length > 0) {
    for (var j = 0; j < this.trailPolylines.length; j++) {
      var dynamic = this.trailPolylines[j].polyline;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(this.trailPolylines[j].id);
      this.map.removeLayer(this.trailPolylines[j].id + "base");
      this.map.removeSource(this.trailPolylines[j].id + "base");
      this.map.removeSource(this.trailPolylines[j].id);
    }
    this.trailPolylines = [];
  }
};
/* 添加轨迹线 */
Map.prototype.addDynamicPolyline = function (wkt, id, color) {
  var map = this.map;
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var positions = [];
  for (var i = 0; i < geoJson.coordinates.length - 1; i++) {
    var startPoint = geoJson.coordinates[i];
    var stopPoint = geoJson.coordinates[i + 1];
    var x1 = startPoint[0];
    var x2 = stopPoint[0];
    var y1 = startPoint[1];
    var y2 = stopPoint[1];
    var add = (x2 - x1) / 700;
    for (var j = 1; j < 701; j++) {
      var xline = x1 + add * j;
      var yline = ((xline - x1) / (x2 - x1)) * (y2 - y1) + y1;
      positions.push([xline, yline]);
    }
  }
  geoJson.coordinates = [positions[0], positions[1]];
  var startnumber = 1;
  if (!id || !wkt || !geoJson.type) {
    return;
  }
  var data = {
    type: "Feature",
    geometry: geoJson,
  };
  var linecolor = "#5555ff" || color;
  map.addLayer({
    id: id,
    type: "line",
    source: {
      type: "geojson",
      data: geoJson,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": linecolor,
      "line-width": 6,
      "line-opacity": 0.8,
    },
  });
  var dynamicpoly = new dynamicPolyline(
    startnumber,
    positions,
    geoJson,
    map,
    id
  );
  dynamicpoly.play;
  this.dynamicPolylines.push({
    polyline: dynamicpoly,
    id: id,
  });
};

function dynamicPolyline(startnumber, positions, geoJson, map, id) {
  this.animation = null;
  var that = this;
  this.play = animateLine();

  function animateLine() {
    if (startnumber == positions.length - 1) {
      startnumber = 1;
      geoJson.coordinates = [positions[0], positions[1]];
    }
    startnumber++;
    geoJson.coordinates.push(positions[startnumber]);
    map.getSource(id).setData(geoJson);
    that.animation = requestAnimationFrame(animateLine);
  }
}
/* 移除轨迹线 */
Map.prototype.removeDynamicPolylineById = function (id) {
  for (var j = 0; j < this.dynamicPolylines.length; j++) {
    if (this.dynamicPolylines[j].id == id) {
      var dynamic = this.dynamicPolylines[j].polyline;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(id);
      this.map.removeSource(id);
      var int = this.dynamicPolylines.indexOf(this.dynamicPolylines[j]);
      this.dynamicPolylines.splice(int, 1);
      break;
    }
  }
};
/* 移除所有轨迹线 */
Map.prototype.removeAllDynamicPolylines = function () {
  if (this.dynamicPolylines.length > 0) {
    for (var j = 0; j < this.dynamicPolylines.length; j++) {
      var dynamic = this.dynamicPolylines[j].polyline;
      cancelAnimationFrame(dynamic.animation);
      this.map.removeLayer(this.dynamicPolylines[j].id);
      this.map.removeSource(this.dynamicPolylines[j].id);
    }
    this.dynamicPolylines = [];
  }
};
/* 添加迁徙图 */
Map.prototype.addMigrateMap = function (
  orainLocation,
  qxdata,
  color,
  color1,
  show
) {
  var map = this.map;
  var polylinecolor = color || "#5555ff";
  var polylinebasecolor = color1 || "#ffffff";
  var showLine = show || false;
  var geoCoordMap = {};
  var convertData = function (data) {
    var res = [];
    data.forEach((dataItem) => {
      res.push({
        fromName: dataItem[0].name,
        toName: dataItem[1].name,
        coords: [orainLocation.position, dataItem[1].position],
      });
    });
    return res;
  };
  var color = [polylinecolor];
  var series = [];
  var planePath =
    "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
  [
    [orainLocation.name, qxdata]
  ].forEach(function (item, i) {
    series.push({
      name: item[0],
      coordinateSystem: "GLMap",
      type: "lines",
      zlevel: 1,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: color[i],
        symbolSize: 5,
      },
      lineStyle: {
        normal: {
          color: polylinebasecolor,
          width: showLine ? 1 : 0,
          curveness: 0.2,
        },
      },
      data: convertData(item[1]),
    }, {
      name: item[0],
      coordinateSystem: "GLMap",
      type: "lines",
      zlevel: 2,
      effect: {
        show: true,
        period: 6,
        trailLength: 0,
        symbol: planePath,
        symbolSize: 15,
      },
      lineStyle: {
        normal: {
          color: color[i],
          width: 1,
          opacity: 0.4,
          curveness: 0.2,
        },
      },
      data: convertData(item[1]),
    }, {
      name: item[0],
      type: "effectScatter",
      coordinateSystem: "GLMap",
      zlevel: 2,
      rippleEffect: {
        brushType: "stroke",
      },
      label: {
        normal: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
      },
      symbolSize: function (val) {
        return val[2] / 8;
      },
      itemStyle: {
        normal: {
          color: "#55ff7f",
        },
      },
      data: item[1].map(function (dataItem) {
        return {
          name: dataItem[1].name,
          value: dataItem[1].position.concat([dataItem[1].value]),
        };
      }),
    });
  });

  var option = {
    animation: false,
    GLMap: {
      roam: true,
    },
    coordinateSystem: "GLMap",
    tooltip: {
      trigger: "item",
    },
    geo: {
      map: "GLMap",
      label: {
        emphasis: {
          show: false,
        },
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: "#323c48",
          borderColor: "#404a59",
        },
        emphasis: {
          areaColor: "#2a333d",
        },
      },
    },
    series: series,
  };
  this.echartslayer = new EchartsLayer(map);
  this.echartslayer.chart.setOption(option);
};
/* 移除迁徙图 */
Map.prototype.removeMigrateMap = function () {
  this.echartslayer.chart.clear();
  var myChart = this.echartslayer._container;
  myChart.parentNode.removeChild(myChart);
};
//初始化完成事件
Map.prototype.ready = function (callback) {
  this.map.on("load", function () {
    if (callback) {
      callback();
    }
  });
};
//添加内置浮窗
Map.prototype.addPop = function (positions, type, text, id, callback) {
  if (!positions || !type || !id || !text) {
    return;
  }
  var html = "";
  var style = "";
  text.forEach((item) => {
    html += `<p>${item}</p>`;
  });
  switch (type) {
    case 1:
      style = "customPop1";
      break;

    case 2:
      style = "customPop2";
      break;

    case 3:
      style = "customPop3";
      break;
  }
  var popup = new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: true,
      className: style,
    })
    .setLngLat(positions)
    .setHTML(html);
  popup.on("open", () => {
    if (callback) {
      callback();
    }
  });
  popup.addTo(this.map);
  var pop = new Pop(this.map, popup, id);
  this.pops.push({
    pop: pop,
    id: id,
    type: "canvas",
  });
  return pop;
};
(Map.prototype.getPopById = function (id) {
  if (!id) {
    return;
  }
  var pop = null;
  for (var j = 0; j < this.pops.length; j++) {
    if (this.pops[j].id == id) {
      pop = this.pops[j].pop;
      break;
    }
  }
  return pop;
}),
//添加自定义div浮窗
(Map.prototype.addCustomDivPop = function (positions, containid, callback) {
  var div = document.getElementById(containid);
  if (!positions || !div) {
    return;
  }
  div.style.bottom = 20 + "px";
  var popup = new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false,
    })
    .setLngLat(positions)
    .setDOMContent(div);
  popup.on("open", () => { 
    if (callback) {
      callback();
    }
  });
  popup.addTo(this.map);
  var pop = new Pop(this.map, popup, containid);
  this.pops.push({
    pop: pop,
    id: containid,
    type: "dom",
  });
  return pop;
});

//根据id移除浮窗
Map.prototype.removePopById = function (id) {
  if (!id) {
    return;
  }
  for (var j = 0; j < this.pops.length; j++) {
    if (this.pops[j].id == id) {
      var pop = this.pops[j].pop.pop;
      pop.remove();
      var int = this.pops.indexOf(this.pops[j]);
      this.pops.splice(int, 1);
      break;
    }
  }
};

//根据id移除浮窗
Map.prototype.removeAllPops = function () {
  if (this.pops.length > 0) {
    this.pops.forEach((item) => {
      if (item.type == "canvas") {
        var int = this.pops.indexOf(item);
        item.pop.pop.remove();
      }
    });
    this.pops.forEach((item) => {
      if (item.type == "canvas") {
        var int = this.pops.indexOf(item);
        this.pops.splice(int, 1);
      }
    });
  }
};

//地图事件关联

/* 添加鼠标缩放事件 */
Map.prototype.addZoomEvent = function (callback) {
  var map = this.map;
  this.zoomEvent = (e) => {
    if (callback) {
      callback({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    }
  };
  map.on("zoom", this.zoomEvent);
};
/* 移除鼠标缩放事件 */
Map.prototype.removeZoomEvent = function () {
  if (this.zoomEvent) {
    this.map.off("zoom", this.zoomEvent);
    this.zoomEvent = null;
  }
};

/* 添加鼠标移动事件 */
Map.prototype.addMoveEvent = function (callback) {
  var map = this.map;
  this.moveEvent = (e) => {
    if (callback) {
      callback(e);
    }
  };
  map.on("mousemove", this.moveEvent);
};
/* 移除鼠标移动事件 */
Map.prototype.removeMoveEvent = function () {
  if (this.moveEvent) {
    this.map.off("mousemove", this.moveEvent);
    this.moveEvent = null;
  }
};

/* 添加相机事件 */
Map.prototype.addCameraEvent = function (callback) {
  var map = this.map;
  this.cameraEvent = (e) => {
    if (callback) {
      var obj = {
        center: this.getCenter(),
        bounds: this.getBounds(),
        zoom: this.getZoom(),
        heading: map.getBearing(),
        pitch: map.getPitch(),
      };
      callback(obj);
    }
  };
  map.on("move", this.cameraEvent);
};
/* 移除鼠标移动事件 */
Map.prototype.removeCameraEvent = function () {
  if (this.cameraEvent) {
    this.map.off("move", this.cameraEvent);
    this.cameraEvent = null;
  }
};

/* 添加鼠标点击事件 */
Map.prototype.addClickEvent = function (callback) {
  var map = this.map;
  this.clickEvent = (e) => {
    if (callback) {
      callback(e);
    }
  };
  map.on("click", this.clickEvent);
};
/* 移除鼠标点击事件 */
Map.prototype.removeClickEvent = function () {
  if (this.clickEvent) {
    this.map.off("click", this.clickEvent);
    this.clickEvent = null;
  }
};
/* 移除地图选择集 */
Map.prototype.removeLayerSelection = function (callback) {
  var map = this.map;
  if (this.Geoselectlayer) {
    map.setFilter(this.Geoselectlayer, ["in", "id", ""]);
    this.Geoselectlayer = null;
  }
};
/* 设置几何要素图层点击事件 */
Map.prototype.addGeoLayerSelectEvent = function (callback) {
  var map = this.map;
  var TYPE = {
    empty: 'empty',
    mvt: 'mvt',
    geometry: 'geometry',
  }
  if (this.GeoclickEvent == null) {
    this.GeoclickEvent = (e) => {
      var target = e.target;
      //如果nodetype为一则是gif图标，需要单独处理
      if (e.target.nodeType === 1) {
        var infosString = target.getAttribute('infos');
        var latlngString = target.getAttribute('latlng');
        var id = target.getAttribute('id');
        var infos = infosString ? JSON.parse(infosString) : {};
        var latlng = latlngString ? JSON.parse(latlngString) : {};
        callback({
          layerId: id,
          type: TYPE.geometry,
          infos,
          position: [latlng.lng, latlng.lat]
        })
      } else {
        //正常图层点击处理流程
        var bbox = [
          [e.point.x - 4, e.point.y - 4],
          [e.point.x + 4, e.point.y + 4],
        ];
        var features = map.queryRenderedFeatures(bbox, {});
        if (this.Geoselectlayer) {
          map.setFilter(this.Geoselectlayer, ["in", "id", ""]);
          this.Geoselectlayer = null;
        }
        if (!features.length) {
          //点击的是地图空白处
          var params = {
            targetMap: '2D',
            position: [e.lngLat.lng, e.lngLat.lat],
          }
          params.type = TYPE.empty;
          callback(params);
        } else {
          const feature = features[0];
          var params = {
            targetMap: '2D',
            position: [e.lngLat.lng, e.lngLat.lat],
          }
          this.Geoselectlayer = feature.layer.id + "hover";
          map.setFilter(this.Geoselectlayer, [
            "in",
            "id",
            feature.properties.id,
          ]);
          if (feature.properties._type === 'geometryLayer') {
            //点击的是geometryLayer
            params.type = TYPE.geometry;
            params.layerId = feature.layer.id;
            params.infos = feature.properties;
          } else {
            //点击的是mvtLayer
            params.type = TYPE.mvt;
            params.layerId = feature.layer.id;
            params.infos = feature.properties
          }
          callback(params);
        }
      }
    };
    map.on("click", this.GeoclickEvent);
  }
};
/* 移除几何要素图层点击事件 */
Map.prototype.removeGeoLayerSelectEvent = function () {
  if (this.GeoclickEvent) {
    this.map.off("click", this.GeoclickEvent);
    this.GeoclickEvent = null;
    if (this.Geoselectlayer) {
      this.map.setFilter(this.Geoselectlayer, ["in", "id", ""]);
      this.Geoselectlayer = null;
    }
  }
};

function metersToPixelsAtMaxZoom(meters, latitude) {
  return meters / 0.075 / Math.cos((latitude * Math.PI) / 180);
}
/* 添加几何要素图层GeoJson */
Map.prototype.addGeoLayerByGeoJson = function (data, id, opt) {
  if (!data || !id) {
    return;
  }
  var map = this.map;
  var options = opt || {};
  var color,
    scale,
    infos,
    width,
    location,
    alpha,
    font,
    fontsize,
    text,
    min,
    max,
    url,
    translate,
    anchor,
    outlineColor = null;
  translate = options.translate || [0, 0];
  min = options.min || 0;
  max = options.max || 21;
  color = options.color || "#ffffff";
  outlineColor = options.outlineColor || "#000000";
  alpha = options.alpha || 1;
  location = options.location || false;
  text = options.text || "";
  font = options.font || ["literal", [" bold  arial,sans-serif"]];
  fontsize = options.fontsize || 16;
  anchor = options.anchor || "center";
  switch (data.features[0].geometry.type) {
    case "Point":
      width = options.width || 7;
      if (options.isLabel) {
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-field": text ? `{${text}}` : text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          paint: {
            "text-color": color,
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-field": text ? `{${text}}` : text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          paint: {
            "text-color": "rgb(255,255,0)",
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "label");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isCircle) {
        scale = options.scale || 10;
        var computerad = metersToPixelsAtMaxZoom(scale, geoJson.coordinates[1]);
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": color,
            "circle-stroke-width": width,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": color,
            "circle-stroke-width": width,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "circle");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isMarker) {
        scale = options.scale || 0.5;
        url = options.url.toString();
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          layout: {
            "icon-image": url,
            "icon-anchor": anchor,
            "icon-size": scale, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text ? `{${text}}` : text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          paint: {
            "icon-color": "#fff",
            "text-color": color,
            "text-translate": translate,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "icon-image": url,
            "icon-size": scale, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text ? `{${text}}` : text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
          paint: {
            "icon-color": "#55ffff",
            "text-color": "rgb(255,255,0)",
            "text-translate": translate,
          },
        });
        var layer = new GeoLayer(this.map, id, location, data, "marker");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isGif) {
        url = options.url.toString();
        var coordinates = geoJson.coordinates;
        var el = new Image();
        el.src = url;
        el.style.width = (options.width || 60) + 'px';
        el.style.height = (options.height || 60) + 'px';
        el.setAttribute('infos', JSON.stringify(options.infos));
        el.setAttribute('latlng', JSON.stringify({
          lng: coordinates[0],
          lat: coordinates[1]
        }));
        var marker = new mapboxgl.Marker({
          element: el
        })
        el.addEventListener('click', (e) => {
          this.GeoclickEvent(e);
        })
        marker.setLngLat(geoJson.coordinates).addTo(this.map);
        var layer = new GeoLayer(this.map, id, location, data, "gif");
        this.geometries.push({
          id,
          layer,
          marker
        });
      } else {
        scale = options.scale || 10;
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": scale,
            "circle-color": color,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": scale,
            "circle-color": "#5555ff",
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "point");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      }
      break;
    case "LineString":
      width = options.width || 7;
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "line",
        source: id,
        paint: {
          "line-color": "#5555ff",
          "line-width": width,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polyline");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;

    case "Polygon":
      this.map.addLayer({
        id: id,
        type: "fill",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": color,
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "fill",
        source: id,
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": "#5555ff",
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polygon");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;
  }
};
/* 添加几何要素图层 */
Map.prototype.addGeoLayer = function (wkt, id, opt) {
  if (!wkt || !id) {
    return;
  }
  var map = this.map;
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var options = opt || null;
  var color,
    scale,
    infos,
    width,
    location,
    alpha,
    font,
    fontsize,
    text,
    min,
    max,
    url,
    translate,
    anchor,
    outlineColor = null;
  min = options.min || 0;
  max = options.max || 21;
  color = options.color || "#ffffff";
  outlineColor = options.outlineColor || "#000000";
  infos = options.infos || {};
  alpha = options.alpha || 1;
  location = options.location || false;
  translate = options.translate || [0, 0];
  text = options.text || "";
  font = options.font || ["literal", [" bold  arial,sans-serif"]];
  fontsize = options.fontsize || 16;
  anchor = options.anchor || "center";
  var positions = [];
  var data = {
    type: "Feature",
    geometry: geoJson,
    properties: {
      ...infos,
      _type: 'geometryLayer'
    },
  };
  switch (data.geometry.type) {
    case "Point":
      width = options.width || 7;
      if (options.isLabel) {
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-justify": "center",
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-anchor": anchor,
            "text-allow-overlap": false,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          paint: {
            "text-color": color,
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-justify": "center",
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-anchor": "center",
            "text-allow-overlap": false,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          paint: {
            "text-color": "rgba(255, 255, 0, 1)",
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "label");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isCircle) {
        scale = options.scale || 10;
        var computerad = metersToPixelsAtMaxZoom(scale, geoJson.coordinates[1]);
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": color,
            "circle-stroke-width": width,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": "#ffff00",
            "circle-stroke-width": width,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "circle");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isMarker) {
        scale = options.scale || 0.5;
        url = options.url.toString();
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          layout: {
            "icon-image": url,
            "icon-anchor": anchor,
            "icon-size": scale, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          paint: {
            "text-color": color,
            "text-translate": translate,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "icon-image": url,
            "icon-anchor": anchor,
            "icon-size": scale + 0.2, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          paint: {
            "text-color": "rgba(255, 255, 0, 1)",
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "marker");
        this.geometries.push({
          id,
          layer,
        });
        return layer;
      } else if (options.isGif) {
        url = options.url.toString();
        var coordinates = geoJson.coordinates;
        var el = new Image();
        el.src = url;
        el.id = id;
        el.style.width = (options.width || 60) + 'px';
        el.style.height = (options.height || 60) + 'px';
        el.setAttribute('infos', JSON.stringify(options.infos));
        el.setAttribute('latlng', JSON.stringify({
          lng: coordinates[0],
          lat: coordinates[1]
        }));
        var marker = new mapboxgl.Marker({
          element: el
        })
        el.addEventListener('click', (e) => {
          this.GeoclickEvent(e);
        })
        marker.setLngLat(geoJson.coordinates).addTo(this.map);
        var layer = new GeoLayer(this.map, id, location, data, "gif");
        this.geometries.push({
          id,
          layer,
          marker
        });
      } else {
        scale = options.scale || 10;
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": scale,
            "circle-color": color,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": scale,
            "circle-color": "#5555ff",
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "point");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      }
      break;
    case "MultiPoint":
      if (options.isLabel) {
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-justify": "center",
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-anchor": "center",
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "text-color": color,
            "text-translate": translate,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "text-rotate": 360,
            "text-letter-spacing": 0,
            "text-justify": "center",
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-anchor": "center",
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "symbol-placement": "point",
            "text-font": font,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "text-color": "#ffff00",
            "text-translate": translate,
          },
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "label");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isCircle) {
        scale = options.scale || 10;
        var computerad = metersToPixelsAtMaxZoom(
          scale,
          geoJson.coordinates[0][1]
        );
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": color,
            "circle-stroke-width": width,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, computerad],
              ],
              base: 2,
            },
            "circle-color": "rgba(255, 255,255, 0)",
            "circle-stroke-color": color,
            "circle-stroke-width": width,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "circle");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else if (options.isMarker) {
        scale = options.scale || 0.5;
        url = options.url.toString();
        this.map.addLayer({
          id: id,
          type: "symbol",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          layout: {
            "icon-image": url,
            "text-anchor": "center",
            "icon-size": scale, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          paint: {
            "text-color": color,
            "text-translate": translate,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "symbol",
          source: id,
          layout: {
            "icon-image": url,
            "text-anchor": "center",
            "icon-size": scale + 0.2, //图标的大小
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "symbol-placement": "point",
            "text-rotate": 360,
            "text-field": text,
            "text-rotation-alignment": "viewport",
            "text-size": fontsize,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-font": font,
          },
          paint: {
            "text-color": "#ffff00",
            "text-translate": translate,
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "marker");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      } else {
        scale = options.scale || 10;
        this.map.addLayer({
          id: id,
          type: "circle",
          source: {
            type: "geojson",
            data: data,
          },
          minzoom: min,
          maxzoom: max,
          paint: {
            "circle-radius": scale,
            "circle-color": color,
          },
        });
        this.map.addLayer({
          id: id + "hover",
          type: "circle",
          source: id,
          paint: {
            "circle-radius": scale,
            "circle-color": "#5555ff",
          },
          minzoom: min,
          maxzoom: max,
          filter: ["in", "id", ""],
        });
        var layer = new GeoLayer(this.map, id, location, data, "point");
        this.geometries.push({
          id,
          layer
        });
        return layer;
      }

      break;
    case "LineString":
      width = options.width || 7;
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "line",
        source: id,
        paint: {
          "line-color": "#5555ff",
          "line-width": width,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polyline");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;
    case "MultiLineString":
      width = options.width || 7;
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "line",
        source: id,
        paint: {
          "line-color": "#5555ff",
          "line-width": width,
        },
        minzoom: min,
        maxzoom: max,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polyline");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;

    case "Polygon":
      var geometry = this.map.addLayer({
        id: id,
        type: "fill",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": color,
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "fill",
        source: id,
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": "#5555ff",
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polygon");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;
    case "MultiPolygon":
      this.map.addLayer({
        id: id,
        type: "fill",
        source: {
          type: "geojson",
          data: data,
        },
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": color,
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
      });
      this.map.addLayer({
        id: id + "hover",
        type: "fill",
        source: id,
        minzoom: min,
        maxzoom: max,
        paint: {
          "fill-color": "#5555ff",
          "fill-opacity": alpha,
          "fill-outline-color": outlineColor,
        },
        filter: ["in", "id", ""],
      });
      var layer = new GeoLayer(this.map, id, location, data, "polygon");
      this.geometries.push({
        id,
        layer
      });
      return layer;
      break;
  }
};
/* 根据id返回Geometry类*/
Map.prototype.getGeometryById = function (id) {
  if (!id) {
    return;
  }
  var geometry = null;

  this.geometries.forEach((item) => {
    if (item.id == id) {
      geometry = item.layer;
    }
  });
  return geometry;
};
/* 根据id移除几何要素图层 */
Map.prototype.removeGeoLayer = function (id) {
  if (!id) {
    return;
  }
  for (var j = 0; j < this.geometries.length; j++) {
    if (this.geometries[j].id == id) {
      var int = this.geometries.indexOf(this.geometries[j]);
      var geometry = this.geometries.splice(int, 1)[0];
      var type = geometry.layer.type;
      var marker = geometry.marker;
      //对gif图标做特殊处理
      if (type === 'gif') {
        marker.remove();
      } else if (this.map.getLayer(id)) {
        this.map.removeLayer(id);
        this.map.removeLayer(id + "hover");
        this.map.removeSource(id);
        break;
      }
    }
  }
};
/* 移除所有几何要素图层 */
Map.prototype.removeAllGeoLayers = function () {
  if (this.geometries.length > 0) {
    for (var j = 0; j < this.geometries.length; j++) {
      var id = this.geometries[j].id;
      if (this.geometries[j].layer.type === 'gif') {
        document.getElementById(id) && document.getElementById(id).remove();
      } else {
        if (this.map.getLayer(id)) {
          this.map.removeLayer(id);
          this.map.removeLayer(id + "hover");
          this.map.removeSource(id);
        }
      }

    }
  }
  this.geometries = [];
};
/* 添加聚合图*/
Map.prototype.addClusterMap = function (positions, id) {
  if (!positions || !id) {
    return;
  }
  var map = this.map;
  var geojson = {
    type: "FeatureCollection",
    features: [],
  };
  for (var i = 0; i < positions.length; i++) {
    var item = positions[i];
    var feature = {
      type: "feature",
      geometry: {
        type: "Point",
        coordinates: [],
      },
    };
    feature.geometry.coordinates = [parseFloat(item.lon), parseFloat(item.lat)];
    geojson.features.push(feature);
  }

  map.addSource(id, {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 100,
  });
  map.addLayer({
    id: id,
    type: "circle",
    source: id,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  });
  map.addLayer({
    id: id + "cluster",
    type: "symbol",
    source: id,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });
  map.addLayer({
    id: id + "uncluster",
    type: "circle",
    source: id,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
  map.on("click", id, function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: [id],
    });
    var clusterId = features[0].properties.cluster_id;
    map.getSource(id).getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  });
  map.on("mouseenter", id, function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", id, function () {
    map.getCanvas().style.cursor = "";
  });
};
/* 移除聚合图*/
Map.prototype.removeClusterMap = function (id) {
  if (!id) {
    return;
  }
  this.map.removeLayer(id);
  this.map.removeLayer(id + "cluster");
  this.map.removeLayer(id + "uncluster");
  this.map.removeSource(id);
};
/* 添加热力图*/
Map.prototype.addHeatMap = function (positions, id, colors) {
  if (!positions || !id) {
    return;
  }
  var map = this.map;
  var heatColors = colors || [
    "#23b7ff",
    "#0177b4",
    "#0310d8",
    "#9601f9",
    "#4c0082",
  ];
  var heatPoints = [];
  var num = positions.length;
  var features = [];
  for (var i = 0; i < num; i++) {
    features[i] = {
      type: "feature",
      geometry: {
        type: "Point",
        coordinates: [positions[i].lon, positions[i].lat],
      },
      properties: {
        value: positions[i].value,
      },
    };
  }

  var heatPoints = {
    type: "FeatureCollection",
    features: features,
  };

  map.addSource(id, {
    type: "geojson",
    data: heatPoints,
  });

  map.addLayer({
    id: id,
    type: "heatmap",
    source: id,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "new_diagnosis"],
        0,
        0,
        1000,
        1,
      ],
      "heatmap-intensity": ["interpolate", ["linear"],
        ["zoom"], 0, 2, 9, 5
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.2,
        heatColors[0],
        0.4,
        heatColors[1],
        0.6,
        heatColors[2],
        0.8,
        heatColors[3],
        1,
        heatColors[4],
      ],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        30,
        1,
        50,
        2,
        70,
        3,
        90,
        4,
        110,
        5,
        130,
        6,
        150,
        7,
        170,
        8,
        190,
        9,
        210,
      ],
      "heatmap-opacity": ["interpolate", ["linear"],
        ["zoom"], 0, 0.9, 9, 0.6
      ],
    },
  });
};
/* 移除热力图*/
Map.prototype.removeHeatMap = function (id) {
  if (!id) {
    return;
  }
  this.map.removeLayer(id);
  this.map.removeSource(id);
};
/* 移除影像图层 */
Map.prototype.removeImageryLayer = function (id) {
  if (!id) {
    return;
  }

  for (var j = 0; j < this.imageryLayers.length; j++) {
    if (this.imageryLayers[j] == id) {
      this.map.removeLayer(id);
      this.map.removeSource(id);
      var int = this.imageryLayers.indexOf(this.imageryLayers[j]);
      this.imageryLayers.splice(int, 1);
      break;
    }
  }
};
/* 添加影像图层 */
Map.prototype.addImageryLayer = function (url, id, min, max) {
  if (!id || !url) {
    return;
  }
  var minlevel = min || 0;
  var maxlevel = max || 21;
  this.map.addLayer({
    id: id,
    type: "raster",
    source: {
      type: "raster",
      tiles: [url],
      tileSize: 256,
    },
    minzoom: minlevel,
    maxzoom: maxlevel,
  });
  this.imageryLayers.push(id);
};

/* 添加mvt */
Map.prototype.addMvtLayer = function (url, id, callback, key) {
  if (!url || !id) {
    return;
  }
  var mvtlayerName = name;
  var layer = new MvtLayer(this.map, url, id, callback, key);
  this.mvtLayers.push(layer);
  return layer;
};
/* 移除mvt */
Map.prototype.removeMvtLayer = function (id) {
  if (!id) {
    return;
  }

  for (var j = 0; j < this.mvtLayers.length; j++) {
    if (this.mvtLayers[j].id == id) {
      var mvt = this.mvtLayers[j];

      mvt.options.layersids.forEach((item) => {
        this.map.removeLayer(item);
      });
      this.map.removeSource(mvt.sourceid);
      var int = this.mvtLayers.indexOf(this.mvtLayers[j]);
      this.mvtLayers.splice(int, 1);
      break;
    }
  }
};

/* 添加本地图层 */
Map.prototype.addLocalLayer = function (id, data) {
  if (!id || !data) return;
  var features = data.items.map(item => {
    var geoJson = window.Terraformer.WKT.parse(item.wkt);
    return {
      type: "Feature",
      geometry: geoJson,
      properties: item.infos || {},
    }
  })
  var res = this.map.addSource(id, {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": features
    }
  })
  if (data.type === 'point') {
    var {
      image,
      scale,
      min,
      max
    } = data;
    this.map.addLayer({
      id: id,
      type: "symbol",
      source: id,
      minzoom: min || 0,
      maxzoom: max || 21,
      layout: {
        "icon-image": image,
        "text-anchor": "center",
        "icon-size": scale,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "symbol-placement": "point",
        "text-rotate": 360,
        "text-field": "",
        "text-rotation-alignment": "viewport",
        "text-size": 14,
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-font": ["literal", [" bold  arial,sans-serif"]]
      }
    })
  } else if (data.type === 'polyline') {
    var {
      color,
      width,
      min,
      max
    } = data;
    this.map.addLayer({
      id: id,
      type: "line",
      source: id,
      minzoom: min || 0,
      maxzoom: max || 21,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": width,
      },
    });
  } else if (data.type === 'polygon') {
    var {
      color,
      alpha,
      outlineColor,
      min,
      max
    } = data;
    this.map.addLayer({
      id: id,
      type: "fill",
      source: id,
      minzoom: min || 0,
      maxzoom: max || 21,
      paint: {
        "fill-color": color,
        "fill-opacity": alpha,
        "fill-outline-color": outlineColor,
      },
    });
  }
  var layer = new GeoLayer(this.map, id, false, {}, data.type);
  return res;
}
/* 相机动作 */
Map.prototype.action = function (type) {
  switch (type) {
    case "zoomin":
      this.map.zoomIn();
      break;
    case "zoomout":
      this.map.zoomOut();
      break;
    case "panleft":
      this.map.panBy([-100, 0]);
      break;
    case "panright":
      this.map.panBy([100, 0]);
      break;
    case "pantop":
      this.map.panBy([0, -100]);
      break;
    case "panbottom":
      this.map.panBy([0, 100]);
      break;
  }
};
/* 设置层级 */
Map.prototype.setZoom = function (zoom) {
  if (!zoom) {
    return;
  }
  this.map.zoomTo(zoom);
};
/* 定位wkt对象 */
Map.prototype.locationWKT = function (wkt, during, callback) {
  var geoJson = window.Terraformer.WKT.parse(wkt);
  var bbox = turf.bbox(geoJson);
  var time = during || 0.01;
  this.map.fitBounds(
    [bbox[0] - 0.0045, bbox[1] - 0.0045, bbox[2] + 0.0045, bbox[3] + 0.0045], {
      duration: time * 1000,
      easing: (t) => {
        if (t == 1) {
          if (callback) {
            callback();
          }
        }
        return t;
      },
    }
  );
};
/* 定位点 */
Map.prototype.locationPoint = function (center, zoom, during, callback) {
  if (!center && center.length != 2) {
    return;
  }
  var zoomlevel = zoom || this.map.getZoom();
  var time = during || 0.01;
  this.map.flyTo({
    center: center,
    zoom: zoomlevel,
    duration: time * 1000,
    easing: (t) => {
      if (t == 1) {
        if (callback) {
          callback();
        }
      }
      return t;
    },
  });
};
/* 定位bounds */
Map.prototype.locationBounds = function (bounds, during, callback, options = {}) {
  if (!bounds || bounds.length != 4) {
    return;
  }
  var time = during || 0.01;
  this.map.fitBounds(bounds, {
    duration: time * 1000,
    ...options,
    time: (t) => {
      if (t == 1) {
        if (callback) {
          callback();
        }
      }
      return t;
    },
  });
};
/* 添加鼠标右击事件 */
Map.prototype.addRightClickEvent = function (callback) {
  var map = this.map
  this.rightClickEvent = e => {
    if (callback) {
      callback(e)
    }
  }
  map.on('contextmenu', this.rightClickEvent);
}
/* 移除鼠标右击事件 */
Map.prototype.removeRightClickEvent = function () {
  if (this.rightClickEvent) {
    this.map.off('contextmenu', this.rightClickEvent);
    this.rightClickEvent = null
  }
}
/* 获取地图heading */
Map.prototype.getHeading = function () {
  return this.map.getBearing();
};
/* 获取地图中心点 */
Map.prototype.getCenter = function () {
  return this.map.getCenter();
};
/* 获取地图层级 */
Map.prototype.getZoom = function () {
  return this.map.getZoom();
};
/* 获取地图范围 */
Map.prototype.getBounds = function () {
  var bounds = [];
  var obj = this.map.getBounds();
  bounds.push(obj._sw.lng);
  bounds.push(obj._sw.lat);
  bounds.push(obj._ne.lng);
  bounds.push(obj._ne.lat);
  return bounds;
};
/* 获取地图范围 */
Map.prototype.getBasemapType = function () {
  var type = "未知类型";
  switch (this.map.getStyle().layers[0].id) {
    case "tdt-img-rest":
      type = "rest服务地图";
      break;
    case "tdt-scvec-tiles":
      type = "四川天地图-矢量";
      break;
    case "tdt-scimg-tiles":
      type = "四川天地图-影像";
      break;
    case "tdt-img-tiles":
      type = "国家天地图-影像";
      break;

    case "tdt-vec-tiles":
      type = "国家天地图-矢量";
      break;

    case "tdt-ter-tiles":
      type = "国家天地图-地形晕渲";
      break;

    case "A4-tiles":
      type = "A4标准地图";
      break;
  }
  return type;
};

/* 底图切换 */
Map.prototype.changeBasemap = function (changeType, opt) {
  var type = this.getBasemapType();
  var maptoken = "";
  var options = opt || {};
  var url = options.url || "";
  var min = options.min || 0;
  var max = options.max || 18;
  if (type == "四川天地图-矢量") {
    this.map.removeLayer("tdt-scvec-tiles");
    this.map.removeSource("raster-tiles-scvec");
  } else if (type == "四川天地图-影像") {
    this.map.removeLayer("tdt-scimg-tiles");
    this.map.removeLayer("tdt-sccta-tiles");
    this.map.removeSource("raster-tiles-sccta");
    this.map.removeSource("raster-tiles-scimg");
  } else if (type == "国家天地图-影像") {
    this.map.removeLayer("tdt-img-tiles");
    this.map.removeLayer("tdt-cva-tiles");
    this.map.removeSource("raster_tiles_img");
    this.map.removeSource("raster-cia");
  } else if (type == "国家天地图-矢量") {
    this.map.removeLayer("tdt-vec-tiles");
    this.map.removeLayer("tdt-cva-tiles");
    this.map.removeSource("raster-tiles-vec");
    this.map.removeSource("raster-cva");
  } else if (type == "国家天地图-地形晕渲") {
    this.map.removeLayer("tdt-ter-tiles");
    this.map.removeLayer("tdt-cta-tiles");
    this.map.removeSource("raster-tiles-ter");
    this.map.removeSource("raster-cta");
  } else if (type == "A4标准地图") {
    this.map.removeLayer("A4-tiles");
    this.map.removeSource("A4");
  } else if (type == "rest服务地图") {
    this.map.removeLayer("tdt-img-rest");
    this.map.removeSource("raster_tiles_rest");
  }
  switch (changeType) {
    case "mapWord-img":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      var sources = [{
          type: "raster",
          tiles: [
            `http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
        {
          type: "raster",
          tiles: [
            `http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
      ];
      var layers = [{
          id: "tdt-img-tiles",
          type: "raster",
          source: "raster_tiles_img",
          minzoom: min,
          maxzoom: max,
        },
        {
          id: "tdt-cva-tiles",
          type: "raster",
          source: "raster-cia",
          minzoom: min,
          maxzoom: max,
          renderWorldCopies: false,
          isConstrain: true,
        },
      ];
      this.map.addSource("raster_tiles_img", sources[0]);
      this.map.addSource("raster-cia", sources[1]);
      this.map.addLayer(layers[0]);
      this.map.addLayer(layers[1]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("tdt-cva-tiles", id);
      this.map.moveLayer("tdt-img-tiles", "tdt-cva-tiles");
      break;
    case "mapWord-vec":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      var sources = [{
          type: "raster",
          tiles: [
            `http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
        {
          type: "raster",
          tiles: [
            `http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
      ];
      var layers = [{
          id: "tdt-vec-tiles",
          type: "raster",
          source: "raster-tiles-vec",
          minzoom: min,
          maxzoom: max,
        },
        {
          id: "tdt-cva-tiles",
          type: "raster",
          source: "raster-cva",
          minzoom: min,
          maxzoom: max,
        },
      ];

      this.map.addSource("raster-tiles-vec", sources[0]);
      this.map.addSource("raster-cva", sources[1]);
      this.map.addLayer(layers[0]);
      this.map.addLayer(layers[1]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("tdt-cva-tiles", id);
      this.map.moveLayer("tdt-vec-tiles", "tdt-cva-tiles");
      break;
    case "mapWord-ter":
      maptoken = options.token || "1b0e6426f7883feec155d6f3e3c8f5e2";
      var sources = [{
          type: "raster",
          tiles: [
            `http://t7.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
        {
          type: "raster",
          tiles: [
            `http://t0.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
      ];
      var layers = [{
          id: "tdt-ter-tiles",
          type: "raster",
          source: "raster-tiles-ter",
          minzoom: min,
          maxzoom: max,
        },
        {
          id: "tdt-cta-tiles",
          type: "raster",
          source: "raster-cta",
          minzoom: min,
          maxzoom: max,
        },
      ];
      this.map.addSource("raster-tiles-ter", sources[0]);
      this.map.addSource("raster-cta", sources[1]);
      this.map.addLayer(layers[0]);
      this.map.addLayer(layers[1]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("tdt-cta-tiles", id);
      this.map.moveLayer("tdt-ter-tiles", "tdt-cta-tiles");
      break;
    case "scmapWord-vec":
      maptoken =
        options.token ||
        "4SVVnPw609KwqSUir46UEKZpjSaCipFATjWgwvPtZVvPznuqeNhHIx3aIhQsi4Nx";
      var sources = [{
        type: "raster",
        tiles: [
          `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudlg_sc/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=聚合天地图瓦片地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
        ],
        tileSize: 256,
      }, ];
      var layers = [{
        id: "tdt-scvec-tiles",
        type: "raster",
        source: "raster-tiles-scvec",
        minzoom: min,
        maxzoom: max,
      }, ];

      this.map.addSource("raster-tiles-scvec", sources[0]);
      this.map.addLayer(layers[0]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("tdt-scvec-tiles", id);
      break;
    case "scmapWord-img":
      maptoken =
        options.token ||
        "4SVVnPw609KwqSUir46UEKZpjSaCipFATjWgwvPtZVvPznuqeNhHIx3aIhQsi4Nx";
      var sources = [{
          type: "raster",
          tiles: [
            `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudom_sc/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=四川省内影像地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
        {
          type: "raster",
          tiles: [
            `http://sichuan.tianditu.gov.cn/imap/imapserver/defaultrest/services/newtianditudom_scann/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=四川省注记地图服务&STYLE=default&TILEMATRIXSET=GetTileMatrix&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&transparent=true&FORMAT=tiles&tk=${maptoken}`,
          ],
          tileSize: 256,
        },
      ];
      var layers = [{
          id: "tdt-scimg-tiles",
          type: "raster",
          source: "raster-tiles-scimg",
          minzoom: min,
          maxzoom: max,
        },
        {
          id: "tdt-sccta-tiles",
          type: "raster",
          source: "raster-tiles-sccta",
          minzoom: min,
          maxzoom: max,
        },
      ];

      this.map.addSource("raster-tiles-scimg", sources[0]);
      this.map.addSource("raster-tiles-sccta", sources[1]);
      this.map.addLayer(layers[0]);
      this.map.addLayer(layers[1]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("raster-tiles-sccta", id);
      this.map.moveLayer("raster-tiles-scimg", "raster-tiles-sccta");
      break;
    case "A4":
      var sources = [{
        type: "raster",
        tiles: [url],
        tileSize: 256,
      }, ];
      var layers = [{
        id: "A4-tiles",
        type: "raster",
        source: "A4",
        minzoom: min,
        maxzoom: max,
      }, ];
      this.map.addSource("A4", sources[0]);
      this.map.addLayer(layers[0]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("A4-tiles", id);
      break;
    case "designRest":
      var sources = [{
        type: "raster",
        tiles: [url],
        tileSize: 256,
      }, ];
      var layers = [{
        id: "tdt-img-rest",
        type: "raster",
        source: "raster_tiles_rest",
        minzoom: min,
        maxzoom: max,
      }, ];
      this.map.addSource("raster_tiles_rest", sources[0]);
      this.map.addLayer(layers[0]);
      var id = this.map.getStyle().layers[0].id;
      this.map.moveLayer("tdt-img-rest", id);
      break;
  }
};

/* 添加地图移动监听 */
Map.prototype.addMapMoveEvent = function (callback) {
  this.moveendEvent = (e) => {
    // let center = this.getCenter();
    // let zoom = this.getZoom();
    let bounds = this.getBounds();
    if (callback) {
      // callback({pos: center, zoom: zoom});
      callback({
        bounds: bounds
      });
    }
  }
  this.map.on("moveend", this.moveendEvent);
}
/* 移除地图移动监听 */
Map.prototype.removeMapMoveEvent = function () {
  if (this.moveendEvent) {
    this.map.off("moveend", this.moveendEvent);
    this.moveendEvent = null;
  }
}
export default Map;
