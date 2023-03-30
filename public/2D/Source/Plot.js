function Plot(map) {
  this.map = map
  this.isMeasure = true //标志状态,是否正在绘制
  if (this.map.getLayer('line-move-Plot')) {
    this.map.removeLayer('line-move-Plot')
    this.map.removeSource('line-move-Plot')
    this.map.removeLayer('line-area-Plot')
    this.map.removeLayer('line-Plot')
    this.map.removeSource('line-Plot')
    this.map.removeSource('line-area-Plot')
    this.map.removeLayer('line-area-stroke-Plot')
    this.map.removeSource('line-area-stroke-Plot')
  }
  this.PlotClickEvent = null
  this.PlotselectLayer = null
  this.selectedfeatrue = null
  this.jsonLine = {
    'type': 'FeatureCollection',
    'features': []
  };
  this.PlotPoints = []
  this.map.addLayer({
    id: 'line-Plot',
    type: 'line',
    source: {
      type: 'geojson',
      data: this.jsonLine
    },
    paint: {
      'line-color': '#ff0000',
      'line-width': 3,
      'line-opacity': 0.65
    }
  });
  this.map.addLayer({
    id: 'line-move-Plot',
    type: 'line',
    source: {
      type: 'geojson',
      data: this.jsonLine
    },
    paint: {
      'line-color': '#ff0000',
      'line-width': 3,
      'line-opacity': 0.65
    }
  });
  this.map.addLayer({
    id: 'line-area-Plot',
    type: 'fill',
    source: {
      type: 'geojson',
      data: this.jsonLine
    },
    paint: {
      'fill-color': '#ff0000',
      'fill-opacity': 0.1
    }
  });
  this.map.addLayer({
    id: 'line-area-stroke-Plot',
    type: 'line',
    source: {
      type: 'geojson',
      data: this.jsonLine
    },
    paint: {
      'line-color': '#000000',
      'line-width': 3,
      'line-opacity': 0.65
    }
  });
  this.mouseClick = null //鼠标点击事件
  this.mouseMove = null //鼠标移动事件
  this.mouseDbClick = null //鼠标双击结束事件
  this.mouseMoveOn = null //移动物体事件
  this.mouseMoveUp = null //移动物体事件
  this.mouseMoveDown = null //移动物体事件
  this.plots = []
  this.ele = document.createElement('div');
  this.ele.setAttribute('class', 'measure-result');
  const optionArea = {
    element: this.ele,
    anchor: 'left',
    offset: [8, 0]
  };
  this.tooltip = new mapboxgl.Marker(optionArea)
    .setLngLat([0, 0])
    .addTo(this.map);

}
/* 允许移动*/
Plot.prototype.alowMove = function () {
  this.mouseMoveOn = e => {
    if (this.selectedfeatrue == null) {
      return
    }
    this.map.getCanvas().style.cursor = 'move';
    var type = this.selectedfeatrue.properties.type
    var id = this.selectedfeatrue.properties.id
    var data = this.map.getSource(id)._data
    var coords = e.lngLat;
    if (type == 'circle' || type == 'label' || type == 'marker') {
      data.geometry.coordinates = [coords.lng, coords.lat]
      this.map.getSource(id).setData(data);
    } else if (type == 'square') {
      var height = Number(data.properties.height)
      var width = Number(data.properties.width)
      var options = {
        units: 'kilometers'
      };
      var center = [coords.lng, coords.lat]
      data.properties.center = center
      var west = turf.rhumbDestination(center, width / 2000, -90, options).geometry.coordinates[0];
      var east = turf.rhumbDestination(center, width / 2000, 90, options).geometry.coordinates[0];
      var north = turf.rhumbDestination(center, height / 2000, 0, options).geometry.coordinates[1];
      var south = turf.rhumbDestination(center, height / 2000, 180, options).geometry.coordinates[1];
      var positions = []
      positions.push([west, north])
      positions.push([west, south])
      positions.push([east, south])
      positions.push([east, north])
      positions.push([west, north])
      data = {
        'type': 'Feature',
        'geometry': {
          "type": "LineString",
          "coordinates": positions
        },
        "properties": data.properties,
      }
      this.map.getSource(id).setData(data);
    }

  }

  this.mouseMoveUp = e => {
    this.map.getCanvas().style.cursor = '';
    this.map.off('mousemove', this.mouseMoveOn);
    this.map.off('touchmove', this.mouseMoveOn);
  }
  this.mouseMoveDown = e => {
    if (this.selectedfeatrue == null) {
      return
    }
    e.preventDefault();
    this.map.on('mousemove', this.mouseMoveOn);
    this.map.once('mouseup', this.mouseMoveUp);

  }
  this.map.on('mousedown', this.mouseMoveDown)


}

/* 禁止移动*/
Plot.prototype.stopMove = function () {
  this.map.off('mousedown', this.mouseMoveDown)
}


/* 绘制圆*/
Plot.prototype.drawCircle = function (rad, color, callback) {
  if (this.mouseClick != null) {
    return
  }
  var circlerad = rad || 500
  var circlecolor = color || '#ff0000'
  var circleinfos = {}
  this.map.getCanvas().style.cursor = 'crosshair';
  this.mouseClick = (e) => {
    var id = Date.now().toString()
    var coords = [e.lngLat.lng, e.lngLat.lat];
    circleinfos.id = id
    circleinfos.rad = circlerad
    circleinfos.color = circlecolor
    circleinfos.type = 'circle'
    var data = {
      'type': 'Feature',
      'geometry': {
        "type": "Point",
        "coordinates": coords
      },
      "properties": circleinfos,
    }
    this.addCircle(data, circlerad, circlecolor, id)
    if (callback) {
      callback({
        id: id,
        geojson: data
      })
    }
    this.deactiveMouse()
  }
  this.map.on('click', this.mouseClick)
}

function metersToPixelsAtMaxZoom(meters, latitude) {
  return meters / 0.075 / Math.cos(latitude * Math.PI / 180)
}
/* 绘制圆*/
Plot.prototype.addCircle = function (geojson, rad, color, id) {
  var computerad = metersToPixelsAtMaxZoom(rad, geojson.geometry.coordinates[1])
  this.map.addLayer({
    "id": id,
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": geojson
    },
    "paint": {
      "circle-radius": {
        stops: [
          [0, 0],
          [20, computerad]
        ],
        base: 2
      },
      "circle-color": "rgba(255, 255,255, 0)",
      "circle-stroke-color": color,
      "circle-stroke-width": 3
    }
  });
  this.map.addLayer({
    "id": id + 'hover',
    "type": "circle",
    "source": id,
    "paint": {
      "circle-radius": {
        stops: [
          [0, 0],
          [20, computerad]
        ],
        base: 2
      },
      "circle-color": "rgba(255, 255,255, 0)",
      "circle-stroke-color": "#5555ff",
      "circle-stroke-width": 3
    },
    'filter': ['in', 'id', '']
  });
  this.plots.push(id)
}
/* 绘制面*/
Plot.prototype.drawPolygon = function (color, callback) {
  if (this.mouseClick != null) {
    return
  }
  this.isMeasure = true;
  this.map.doubleClickZoom.disable();
  var polygoncolor = color || '#ff0000'
  var polygoninfos = {}
  this.map.getCanvas().style.cursor = 'crosshair';
  this.mouseClick = (e) => {
    if (this.isMeasure) {
      var coords = [e.lngLat.lng, e.lngLat.lat];
      this.PlotPoints.push(coords)
    }
  }
  this.mouseMove = _e => {
    if (this.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      var len = this.PlotPoints.length;

      if (len === 0) {
        this.ele.innerHTML = '点击地图开始绘制';
      } else if (len === 1) {
        this.ele.innerHTML = '继续绘制,请至少绘制三个点,双击结束';
      } else {
        var pts = this.PlotPoints.concat([coords]);
        pts = pts.concat([this.PlotPoints[0]]);
        var json = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [pts]
          }
        };
        this.map.getSource('line-area-Plot').setData(json);
        this.map.getSource('line-area-stroke-Plot').setData(json);
      }
      this.tooltip.setLngLat(coords);
    }
  }
  this.mouseDbClick = _e_ => {
    if (this.isMeasure) {
			this.ele.remove();
      var coords = [_e_.lngLat.lng, _e_.lngLat.lat];
      this.map.getCanvas().style.cursor = '';
      this.isMeasure = false;
      var pts = this.PlotPoints.concat([coords]);
      pts = pts.concat([this.PlotPoints[0]]);
      var id = Date.now().toString()
      polygoninfos.color = polygoncolor
      polygoninfos.id = id
      polygoninfos.type = 'polygon'
      var data = {
        'type': 'Feature',
        'geometry': {
          "type": "Polygon",
          "coordinates": [pts]
        },
        "properties": polygoninfos,
      }
      this.addPolygon(data, polygoncolor, id)
      if (callback) {
        callback({
          id: id,
          geojson: data
        })
      }
      this.deactiveMouse()
    }
  }
  this.map.on('click', this.mouseClick)
  this.map.on('mousemove', this.mouseMove)
  this.map.on('dblclick', this.mouseDbClick)

}

/* 绘制面*/
Plot.prototype.addPolygon = function (data, polygoncolor, id) {
  this.map.addLayer({
    "id": id,
    "type": "fill",
    "source": {
      "type": "geojson",
      "data": data
    },
    'paint': {
      'fill-color': polygoncolor,
      'fill-opacity': 0.7
    }
  });
  this.map.addLayer({
    "id": id + 'stroke',
    "type": "line",
    "source": id,
    'paint': {
      'line-color': '#000000',
      'line-width': 2,
      'line-opacity': 0.65
    }
  });
  this.map.addLayer({
    "id": id + 'hover',
    "type": "fill",
    "source": id,
    'paint': {
      'fill-color': "#5555ff",
      'fill-opacity': 0.7
    },
    'filter': ['in', 'id', '']
  });
  this.plots.push(id)
}
/* 绘制图标*/
Plot.prototype.drawMarker = function (url, size, callback) {
  if (this.mouseClick != null || !url) {
    return
  }
  var markersize = size || 500
  var markerinfos = {}
  var id = Date.now().toString()
  this.map.getCanvas().style.cursor = 'crosshair';
  this.map.loadImage(url, (error, image) => {
    if (error) throw error;
    this.map.addImage(id, image);
  })
  this.mouseClick = (e) => {
    var coords = [e.lngLat.lng, e.lngLat.lat];
    markerinfos.id = id
    markerinfos.url = url
    markerinfos.size = markersize
    markerinfos.type = 'marker'
    var data = {
      'type': 'Feature',
      'geometry': {
        "type": "Point",
        "coordinates": coords
      },
      "properties": markerinfos,
    }
    this.addMarker(data, url, markersize, id)
    if (callback) {
      callback({
        id: id,
        geojson: data
      })
    }
    this.deactiveMouse()
  }

  this.map.on('click', this.mouseClick)
}
/* 绘制线*/
Plot.prototype.drawPolyline = function (color, type, callback) {
  if (this.mouseClick != null) {
    return
  }
  this.isMeasure = true;
  this.map.doubleClickZoom.disable();
  var polylinecolor = color || '#ff0000'
  var polylineinfos = {}
  var polylinetype = type || 1
  var id = Date.now().toString()
  polylineinfos.id = id
  polylineinfos.color = polylinecolor
  polylineinfos.type = 'polyline'
  polylineinfos.lineStyle = polylinetype
  this.map.getCanvas().style.cursor = 'crosshair';
  this.mouseClick = (e) => {
    if (this.isMeasure) {
      var coords = [e.lngLat.lng, e.lngLat.lat];
      if (this.jsonLine.features.length > 0) {
        var prev = this.jsonLine.features[this.jsonLine.features.length - 1];
        this.jsonLine.features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [prev.geometry.coordinates, coords]
          }
        });
        this.map.getSource('line-Plot').setData(this.jsonLine);
      }
      this.jsonLine.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      });
      this.PlotPoints.push(coords)
    }
  }
  this.mouseMove = _e => {
    if (this.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      if (this.jsonLine.features.length > 0) {
        var prev = this.jsonLine.features[this.jsonLine.features.length - 1];
        var json = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [prev.geometry.coordinates, coords]
          }
        };
        this.map.getSource('line-move-Plot').setData(json);
      } else {
        this.ele.innerHTML = '点击开始绘制,双击结束';
      }
      this.tooltip.setLngLat(coords);
    }
  }
  this.mouseDbClick = _e_ => {
    if (this.isMeasure) {
      var coords = [_e_.lngLat.lng, _e_.lngLat.lat];
      this.map.getCanvas().style.cursor = '';
      this.isMeasure = false;
      var data = null
      this.PlotPoints.splice(this.PlotPoints.length - 1, 1)
      switch (polylinetype) {
        case 1:
          var lastPoint = this.PlotPoints[this.PlotPoints.length - 1]
          var lastBeforePoint = this.PlotPoints[this.PlotPoints.length - 2]
          var data = this.PlotPoints
          var rad = turf.rhumbBearing(lastPoint, lastBeforePoint)
          var _points = [lastBeforePoint, lastPoint];
          var line = turf.lineString(_points);
          var len = turf.length(line);
          var options = {
            units: 'miles'
          };
          var destination = turf.rhumbDestination(lastPoint, len / 5, rad + 45, options).geometry.coordinates;
          var destination1 = turf.rhumbDestination(lastPoint, len / 5, rad - 45, options).geometry.coordinates;
          data = {
            'type': 'Feature',
            'geometry': {
              "type": "MultiLineString",
              "coordinates": [this.PlotPoints, [lastPoint, destination1],
                [lastPoint, destination]
              ]
            },
            "properties": polylineinfos,
          }
          break;

        case 2:
          data = {
            'type': 'Feature',
            'geometry': {
              "type": "LineString",
              "coordinates": this.PlotPoints
            },
            "properties": polylineinfos,
          }
          break;

        case 3:
          break;
      }
      this.addPolyline(data, polylinecolor, id)
      if (callback) {
        callback({
          id: id,
          geojson: data
        })
      }
      this.deactiveMouse()
    }
  }
  this.map.on('click', this.mouseClick)
  this.map.on('mousemove', this.mouseMove)
  this.map.on('dblclick', this.mouseDbClick)

}

/* 绘制线*/
Plot.prototype.addPolyline = function (data, polygoncolor, id) {
  this.map.addLayer({
    "id": id,
    "type": "line",
    "source": {
      "type": "geojson",
      "data": data
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": polygoncolor,
      "line-width": 3
    }
  });
  this.map.addLayer({
    "id": id + 'hover',
    "type": "line",
    "source": id,
    "paint": {
      "line-color": "#5555ff",
      "line-width": 3
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    'filter': ['in', 'id', '']
  });
  this.plots.push(id)
}
/* 绘制图标*/
Plot.prototype.addMarker = function (geojson, url, markersize, id) {
  if (!this.map.hasImage) {
    this.map.loadImage(url, (error, image) => {
      if (error) throw error;
      this.map.addImage(id, image);
      this.map.addLayer({
        "id": id,
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": geojson
        },
        "layout": {
          "icon-image": id,
          "icon-size": {
            'stops': [
              [0, 0],
              [20, markersize]
            ],
            'base': 2
          },
        },

      });
      this.map.addLayer({
        "id": id + 'hover',
        "type": "symbol",
        "source": id,
        "layout": {
          "icon-image": id,
          "icon-size": {
            'stops': [
              [0, 0],
              [20, markersize * 1.2]
            ],
            'base': 2
          },
        },
        'filter': ['in', 'id', '']
      });
    })
  } else {
    this.map.addLayer({
      "id": id,
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": geojson
      },
      "layout": {
        "icon-image": id,
        "icon-size": {
          'stops': [
            [0, 0],
            [20, markersize]
          ],
          'base': 2
        },
      }
    });
    this.map.addLayer({
      "id": id + 'hover',
      "type": "symbol",
      "source": id,
      "layout": {
        "icon-image": id,
        "icon-size": {
          'stops': [
            [0, 0],
            [20, markersize * 1.2]
          ],
          'base': 2
        },
      },
      'filter': ['in', 'id', '']
    });
  }
  this.plots.push(id)
}
/* 绘制矩形*/
Plot.prototype.drawSquare = function (color, x, y, callback) {
  if (this.mouseClick != null) {
    return
  }
  var width = x / 1000 || 0.5
  var height = y / 1000 || 0.5
  var squareinfos = {}
  var squarecolor = color || '#ff0000'
  var id = Date.now().toString()
  this.map.getCanvas().style.cursor = 'crosshair';
  this.mouseClick = (e) => {
    var coords = [e.lngLat.lng, e.lngLat.lat];
    squareinfos.id = id
    squareinfos.width = width * 1000
    squareinfos.height = height * 1000
    squareinfos.color = squarecolor
    squareinfos.center = coords
    squareinfos.type = 'square'
    var options = {
      units: 'kilometers'
    };
    var west = turf.rhumbDestination(coords, width / 2, -90, options).geometry.coordinates[0];
    var east = turf.rhumbDestination(coords, width / 2, 90, options).geometry.coordinates[0];
    var north = turf.rhumbDestination(coords, height / 2, 0, options).geometry.coordinates[1];
    var south = turf.rhumbDestination(coords, height / 2, 180, options).geometry.coordinates[1];
    var positions = []
    positions.push([west, north])
    positions.push([west, south])
    positions.push([east, south])
    positions.push([east, north])
    positions.push([west, north])
    var data = {
      'type': 'Feature',
      'geometry': {
        "type": "LineString",
        "coordinates": positions
      },
      "properties": squareinfos,
    }
    this.addSquare(data, squarecolor, id)
    if (callback) {
      callback({
        id: id,
        geojson: data
      })
    }
    this.deactiveMouse()
  }

  this.map.on('click', this.mouseClick)
}
/* 绘制矩形*/
Plot.prototype.addSquare = function (data, color, id) {
  this.map.addLayer({
    "id": id,
    "type": "line",
    "source": {
      "type": "geojson",
      "data": data
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": color,
      "line-width": 3
    }
  });
  this.map.addLayer({
    "id": id + 'hover',
    "type": "line",
    "source": id,
    "paint": {
      "line-color": "#5555ff",
      "line-width": 3
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    'filter': ['in', 'id', '']
  });
  this.plots.push(id)
}
/* 绘制文字*/
Plot.prototype.drawLabel = function (fontsize, color, text, callback) {
  if (this.mouseClick != null) {
    return
  }
  var labelsize = fontsize || 18
  var labelcolor = color || '#ff0000'
  var labelinfos = {}
  var labeltext = text || '文本'
  this.map.getCanvas().style.cursor = 'crosshair';
  this.mouseClick = (e) => {
    var id = Date.now().toString()
    var coords = [e.lngLat.lng, e.lngLat.lat];
    labelinfos.id = id
    labelinfos.fontsize = fontsize
    labelinfos.color = labelcolor
    labelinfos.text = labeltext
    labelinfos.type = 'label'
    var data = {
      'type': 'Feature',
      'geometry': {
        "type": "Point",
        "coordinates": coords
      },
      "properties": labelinfos,
    }
    this.addLabel(data, labelsize, labelcolor, labeltext, id)
    if (callback) {
      callback({
        id: id,
        geojson: data
      })
    }
    this.deactiveMouse()
  }
  this.map.on('click', this.mouseClick)
}
/* 绘制文字*/
Plot.prototype.addLabel = function (geojson, fontsize, color, text, id) {
  this.map.addLayer({
    "id": id,
    "type": "symbol",
    "source": {
      "type": "geojson",
      "data": geojson
    },
    "layout": {
      "text-rotate": 360,
      "text-letter-spacing": 0,
      "text-justify": "center",
      "text-field": text,
      "text-rotation-alignment": "viewport",
      "text-size": fontsize,
      "icon-size": 0.5,
      "text-anchor": "center",
      "text-allow-overlap": false,
      "text-ignore-placement": true,
      "symbol-placement": "point",
      "text-font": ['literal', [' bold  arial,sans-serif']],
      'icon-image': 'background-label'
    },
    "paint": {
      "text-halo-color": "rgba(96,96,96,1.00)",
      "text-color": color,
      "text-halo-width": 1,
    },
  });
  this.map.addLayer({
    "id": id + 'hover',
    "type": "symbol",
    "source": id,
    "layout": {
      "text-rotate": 360,
      "text-letter-spacing": 0,
      "text-justify": "center",
      "text-field": text,
      "icon-size": 0.5,
      "text-rotation-alignment": "viewport",
      "text-size": fontsize,
      "text-anchor": "center",
      "text-allow-overlap": false,
      "text-ignore-placement": true,
      "symbol-placement": "point",
      'icon-image': 'background-label',
      "text-font": ['literal', [' bold  arial,sans-serif']]
    },
    "paint": {
      "text-color": 'rgba(0,0,255,0.6)',
      "text-halo-color": 'rgba(0,0,255,0.6)',
      "text-halo-width": 1
    },
    'filter': ['in', 'id', '']
  });
  this.plots.push(id)
}
Plot.prototype.deactiveMouse = function () {
  if (this.mouseClick) {
    this.map.off('click', this.mouseClick)
    this.mouseClick = null
  }
  if (this.mouseMove) {
    this.map.off('mousemove', this.mouseMove)
    this.mouseMove = null
  }
  if (this.mouseDbClick) {
    this.map.off('dblclick', this.mouseDbClick)
    this.mouseDbClick = null
  }
  this.map.getCanvas().style.cursor = '';
  this.PlotPoints = []
  this.jsonLine = {
    'type': 'FeatureCollection',
    'features': []
  };
  this.ele.innerHTML = ''
  this.tooltip.setLngLat([0, 0])
  this.map.getSource('line-area-Plot').setData(this.jsonLine);
  this.map.getSource('line-area-stroke-Plot').setData(this.jsonLine);
  this.map.getSource('line-Plot').setData(this.jsonLine);
  this.map.getSource('line-move-Plot').setData(this.jsonLine);
  setTimeout(() => {
    this.map.doubleClickZoom.enable();
  }, 100)
}
Plot.prototype.removeBySelect = function () {
  if (this.selectedfeatrue) {
    var item = this.selectedfeatrue.layer.id
    if (!item) {
      return
    }
    if (this.selectedfeatrue.layer.type == 'fill') {
      if (this.map.getLayer(item + 'hover')) {
        this.map.removeLayer(item + 'hover')
      }
      if (this.map.getLayer(item)) {
        this.map.removeLayer(item)
      }
      if (this.map.getLayer(item + 'stroke')) {
        this.map.removeLayer(item + 'stroke')
      }
      if (this.map.getSource(item)) {
        this.map.removeSource(item)
      }
    } else {
      if (this.map.getLayer(item + 'hover')) {
        this.map.removeLayer(item + 'hover')
      }
      if (this.map.getLayer(item)) {
        this.map.removeLayer(item)
      }
      if (this.map.getSource(item)) {
        this.map.removeSource(item)
      }
    }
  }

}
Plot.prototype.removeAll = function () {
  this.plots.forEach(item => {
    if (this.map.getLayer(item + 'hover')) {
      this.map.removeLayer(item + 'hover')
    }
    if (this.map.getLayer(item)) {
      this.map.removeLayer(item)
    }
    if (this.map.getLayer(item + 'stroke')) {
      this.map.removeLayer(item + 'stroke')
    }
    if (this.map.getSource(item)) {
      this.map.removeSource(item)
    }
  })
}
Plot.prototype.addSelectEvent = function (callback) {
  var map = this.map
  this.PlotClickEvent = e => {
    this.selectedfeatrue = null
    var bbox = [
      [e.point.x - 15, e.point.y - 15],
      [e.point.x + 15, e.point.y + 15]
    ];
    var features = map.queryRenderedFeatures(bbox, {});
    if (this.PlotselectLayer) {
      if (this.map.getLayer(this.PlotselectLayer)) {
        map.setFilter(this.PlotselectLayer, ['in', 'id', '']);
        this.PlotselectLayer = null
      }
    }
    if (features && features.length > 0 && map.getLayer(features[0].layer.id + 'hover')) {
      this.selectedfeatrue = features[0]
      if (callback) {
        callback({
          geojson: this.map.getSource(features[0].layer.id)._data,
          infos: features[0].properties,
          position: [e.lngLat.lng, e.lngLat.lat]
        })
      }
      this.PlotselectLayer = features[0].layer.id + 'hover'
      if (this.map.getLayer(this.PlotselectLayer)) {
        map.setFilter(this.PlotselectLayer, ['in', 'id', features[0].properties.id]);
      }
    }
  }
  map.on('click', this.PlotClickEvent);
}
Plot.prototype.location = function (id) {
  if (this.map.getSource(id)) {
    var data = this.map.getSource(id)._data
    var bbox = turf.bbox(data)
    this.map.fitBounds([bbox[0] - 0.1, bbox[1] - 0.1, bbox[2] + 0.1, bbox[3] + 0.1], {
      animate: false,
    })
  }
}
Plot.prototype.removeSelectEvent = function () {
  if (this.PlotClickEvent) {
    this.map.off('click', this.PlotClickEvent);
    this.PlotClickEvent = null
    if (this.PlotselectLayer) {
      this.map.setFilter(this.PlotselectLayer, ['in', 'id', '']);
      this.PlotselectLayer = null
    }
  }
}
Plot.prototype.changeStyle = function (typevalue, value) {
  if (this.selectedfeatrue == null) {
    return
  }
  var infos = this.selectedfeatrue.properties
  var type = this.selectedfeatrue.properties.type
  var id = this.selectedfeatrue.properties.id
  var data = this.map.getSource(id)._data
  if (type == 'circle') {
    switch (typevalue) {
      case 'rad':
        var computerad = metersToPixelsAtMaxZoom(Number(value), this.map.getSource(id)._data.geometry.coordinates[1])
        this.map.setPaintProperty(id, 'circle-radius', {
          stops: [
            [0, 0],
            [20, computerad]
          ],
          base: 2
        })
        this.map.setPaintProperty(id + 'hover', 'circle-radius', {
          stops: [
            [0, 0],
            [20, computerad]
          ],
          base: 2
        })
        data.properties.rad = Number(value)
        break;
      case 'color':
        this.map.setPaintProperty(id, 'circle-stroke-color', value)
        data.properties.color = value
        break;
    }
    this.map.getSource(id).setData(data)
  } else if (type == 'label') {
    switch (typevalue) {
      case 'text':
        this.map.setLayoutProperty(id, 'text-field', value)
        this.map.setLayoutProperty(id + 'hover', 'text-field', value)
        data.properties.text = value
        break;

      case 'color':
        this.map.setPaintProperty(id, 'text-color', value)
        data.properties.color = value
        break;

      case 'fontsize':
        this.map.setLayoutProperty(id, 'text-size', value)
        this.map.setLayoutProperty(id + 'hover', 'text-size', value)
        data.properties.fontsize = value
        break;


    }

    this.map.getSource(id).setData(data)
  } else if (type == 'polyline') {
    switch (typevalue) {
      case 'color':
        this.map.setPaintProperty(id, 'line-color', value)
        data.properties.color = value
        break
    }
    this.map.getSource(id).setData(data)
  } else if (type == 'polygon') {
    switch (typevalue) {

      case 'color':
        this.map.setPaintProperty(id, 'fill-color', value)
        data.properties.color = value
        break
    }
    this.map.getSource(id).setData(data)
  } else if (type == 'square') {
    switch (typevalue) {

      case 'color':
        this.map.setPaintProperty(id, 'line-color', value)
        data.properties.color = value
        break

      case 'width':
        data.properties.width = Number(value)
        var options = {
          units: 'kilometers'
        };
        var coords = data.properties.center
        var west = turf.rhumbDestination(coords, Number(value) / 2000, -90, options).geometry.coordinates[0];
        var east = turf.rhumbDestination(coords, Number(value) / 2000, 90, options).geometry.coordinates[0];
        var north = turf.rhumbDestination(coords, Number(data.properties.height / 2000), 0, options).geometry.coordinates[1];
        var south = turf.rhumbDestination(coords, Number(data.properties.height / 2000), 180, options).geometry.coordinates[1];
        var positions = []
        positions.push([west, north])
        positions.push([west, south])
        positions.push([east, south])
        positions.push([east, north])
        positions.push([west, north])
        data = {
          'type': 'Feature',
          'geometry': {
            "type": "LineString",
            "coordinates": positions
          },
          "properties": data.properties,
        }

        break;

      case 'height':

        data.properties.height = Number(value)
        var options = {
          units: 'kilometers'
        };
        var coords = data.properties.center
        var west = turf.rhumbDestination(coords, Number(data.properties.width / 2000), -90, options).geometry.coordinates[0];
        var east = turf.rhumbDestination(coords, Number(data.properties.width / 2000), 90, options).geometry.coordinates[0];
        var north = turf.rhumbDestination(coords, Number(value) / 2000, 0, options).geometry.coordinates[1];
        var south = turf.rhumbDestination(coords, Number(value) / 2000, 180, options).geometry.coordinates[1];
        var positions = []
        positions.push([west, north])
        positions.push([west, south])
        positions.push([east, south])
        positions.push([east, north])
        positions.push([west, north])
        data = {
          'type': 'Feature',
          'geometry': {
            "type": "LineString",
            "coordinates": positions
          },
          "properties": data.properties,
        }
        break;
    }
    this.map.getSource(id).setData(data)
  } else if (type == 'marker') {
    switch (typevalue) {
      case 'url':
        this.map.loadImage(value, (error, image) => {
          if (error) throw error;
          this.map.removeImage(id);
          this.map.addImage(id, image);
          this.map.setFilter(this.PlotselectLayer, ['in', 'id', '']);
          this.PlotselectLayer = null
        })
        data.properties.url = value
        break;

      case 'size':
        this.map.setLayoutProperty(id, 'icon-size', {
          'stops': [
            [0, 0],
            [20, Number(value)]
          ],
          'base': 2
        })
        this.map.setLayoutProperty(id + 'hover', 'icon-size', {
          'stops': [
            [0, 0],
            [20, Number(value) * 1.2]
          ],
          'base': 2
        })
        data.properties.size = Number(value)
        break;
    }
    this.map.getSource(id).setData(data)
  }
}
export default Plot
