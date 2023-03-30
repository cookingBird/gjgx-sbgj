function Measure(map) {
	this.map = map
	this.jsonPoint = {
		'type': 'FeatureCollection',
		'features': []
	};
	this.jsonLine = {
		'type': 'FeatureCollection',
		'features': []
	};
	this.markers = []
	this.points = []
	if (this.map.getLayer('line-move-measure')) {
		this.map.removeLayer('line-move-measure')
		this.map.removeLayer('line-measure')
		this.map.removeLayer('points-measure')
		this.map.removeSource('line-move-measure')
		this.map.removeSource('line-measure')
		this.map.removeSource('points-measure')
	}
	this.isMeasure = true //标志状态,是否正在绘制
	this.map.addLayer({
		id: 'line-move-measure',
		type: 'line',
		source: {
			type: 'geojson',
			data: this.jsonLine
		},
		paint: {
			'line-color': '#00ffff',
			'line-width': 3,
			'line-opacity': 0.65
		}
	});
	this.map.addLayer({
		id: 'line-measure',
		type: 'line',
		source: {
			type: 'geojson',
			data: this.jsonLine
		},
		paint: {
			'line-color': '#00ffff',
			'line-width': 3,
			'line-opacity': 0.65
		}
	});
	this.map.addLayer({
		id: 'points-measure',
		type: 'circle',
		source: {
			type: 'geojson',
			data: this.jsonPoint
		},
		paint: {
			'circle-color': '#ffffff',
			'circle-radius': 4,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#ff0000'
		}
	});
	this.elemove = document.createElement('div');
	this.elemove.setAttribute('class', 'measure-result');
	const option = {
		element: this.elemove,
		anchor: 'left',
		offset: [8, 0]
	};
	this.tooltip = new mapboxgl.Marker(option)
		.setLngLat([0, 0])
		.addTo(this.map);
		
		
		
	this.jsonPointArea = {
		'type': 'FeatureCollection',
		'features': []
	};
	this.jsonLineArea = {
		'type': 'FeatureCollection',
		'features': []
	};
	this.markersArea = []
	this.pointsArea = []
	if (this.map.getLayer('line-area')) {
		this.map.removeLayer('line-area')
		this.map.removeLayer('line-area-stroke')
		this.map.removeLayer('points-area')
		this.map.removeSource('line-area')
		this.map.removeSource('line-area-stroke')
		this.map.removeSource('points-area')
	}
	this.map.addLayer({
		id: 'line-area',
		type: 'fill',
		source: {
			type: 'geojson',
			data: this.jsonLineArea
		},
		paint: {
			'fill-color': '#ff0000',
			'fill-opacity': 0.1
		}
	});
	this.map.addLayer({
		id: 'line-area-stroke',
		type: 'line',
		source: {
			type: 'geojson',
			data: this.jsonLineArea
		},
		paint: {
			'line-color': '#00ffff',
			'line-width': 2,
			'line-opacity': 0.65
		}
	});
	this.map.addLayer({
		id: 'points-area',
		type: 'circle',
		source: {
			type: 'geojson',
			data: this.jsonPointArea
		},
		paint: {
			'circle-color': '#ffffff',
			'circle-radius': 4,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#ff0000'
		}
	});
	this.elemoveArea = document.createElement('div');
	this.elemoveArea.setAttribute('class', 'measure-result');
	const optionArea = {
		element: this.elemoveArea,
		anchor: 'left',
		offset: [8, 0]
	};
	this.tooltipArea = new mapboxgl.Marker(optionArea)
		.setLngLat([0, 0])
		.addTo(this.map);
	this.mouseClick = null //鼠标点击事件
	this.mouseMove = null //鼠标移动事件
	this.mouseDbClick = null //鼠标双击结束事件

}
/* 测量距离*/
Measure.prototype.measureLine = function() {
	this.isMeasure = true;
	this.clearLine()
	this.map.doubleClickZoom.disable();
	this.map.getCanvas().style.cursor = 'crosshair';
	this.mouseClick = (e) => {
		if (this.isMeasure) {
			var coords = [e.lngLat.lng, e.lngLat.lat];
			//添加marker			
			const ele = document.createElement('div');
			ele.setAttribute('class', 'measure-result');
			const option = {
				element: ele,
				anchor: 'left',
				offset: [8, 0]
			};
			ele.innerHTML = this.points.length === 0 ? '起点' : this.getLength(coords);
			var marker = new mapboxgl.Marker(option)
				.setLngLat(coords)
				.addTo(this.map);
			this.markers.push(marker);
			//绘制点,线

			if (this.jsonPoint.features.length > 0) {
				var prev = this.jsonPoint.features[this.jsonPoint.features.length - 1];
				this.jsonLine.features.push({
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [prev.geometry.coordinates, coords]
					}
				});
				this.map.getSource('line-measure').setData(this.jsonLine);
			}
			this.jsonPoint.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: coords
				}
			});
			this.map.getSource('points-measure').setData(this.jsonPoint);
			this.points.push(coords)
		}
	}
	this.mouseMove = _e => {
		if (this.isMeasure) {
			var coords = [_e.lngLat.lng, _e.lngLat.lat];
			if (this.jsonPoint.features.length > 0) {
				var prev = this.jsonPoint.features[this.jsonPoint.features.length - 1];
				var json = {
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [prev.geometry.coordinates, coords]
					}
				};
				this.map.getSource('line-move-measure').setData(json);
				this.elemove.innerHTML = this.getLength(coords);

			} else {
				this.elemove.innerHTML = '左键点击地图开始测量,双击结束绘制';
			}
			this.tooltip.setLngLat(coords);
		}
	}
	this.mouseDbClick = _e_ => {
		if (this.isMeasure) {
			var coords = [_e_.lngLat.lng, _e_.lngLat.lat];
			if (this.jsonPoint.features.length > 0) {
				var prev = this.jsonPoint.features[this.jsonPoint.features.length - 1];
				this.jsonLine.features.push({
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [prev.geometry.coordinates, coords]
					}
				});
				this.map.getSource('line-measure').setData(this.jsonLine);
			}
			this.jsonPoint.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: coords
				}
			});
			this.map.getSource('points-measure').setData(this.jsonPoint);
			this.isMeasure = false;
			this.map.getCanvas().style.cursor = '';
			this.jsonPoint.features = [];
			this.jsonLine.features = [];
			this.tooltip.remove();
		}
	}
	this.map.on('click', this.mouseClick)
	this.map.on('mousemove', this.mouseMove)
	this.map.on('dblclick', this.mouseDbClick)
}
/* 测量面积*/
Measure.prototype.measureArea = function() {
	this.isMeasure = true;
	this.clearArea()
	this.map.doubleClickZoom.disable();
	this.map.getCanvas().style.cursor = 'crosshair';
	this.mouseClick = (e) => {
		if (this.isMeasure) {
			var coords = [e.lngLat.lng,e.lngLat.lat];
			this.pointsArea.push(coords)
			this.jsonPointArea.features.push({
			      type: 'Feature',
			      geometry: {
			        type: 'Point',
			        coordinates: coords
			      }
			    });
			this.map.getSource('points-area').setData(this.jsonPointArea);
		}
	}
	this.mouseMove = _e => {
		if (this.isMeasure) {
			var coords = [_e.lngLat.lng, _e.lngLat.lat];
			      var len =this.jsonPointArea.features.length;
			      if (len === 0) {
			        this.elemoveArea.innerHTML = '点击地图开始测量,双击结束';
			      } else if (len ===1) {
			        this.elemoveArea.innerHTML = '点击地图继续绘制';
			      } else {
			        var pts =this.pointsArea.concat([coords]);
			        pts = pts.concat([this.pointsArea[0]]);
			        var json = {
			          type: 'Feature',
			          geometry: {
			            type: 'Polygon',
			            coordinates: [pts]
			          }
			        };
			        this.map.getSource('line-area').setData(json);
					this.map.getSource('line-area-stroke').setData(json);
			        this.elemoveArea.innerHTML = this.getArea(coords);
			      }
			      this.tooltipArea.setLngLat(coords);
		}
	}
	this.mouseDbClick = _e_ => {
		if (this.isMeasure) {
			var coords = [_e_.lngLat.lng, _e_.lngLat.lat];
			this.map.getCanvas().style.cursor = '';
			this.pointsArea.push(coords);
			this.isMeasure = false;
			this.elemoveArea.innerHTML = this.getArea(coords);
			this.tooltipArea.setLngLat(coords);
		}
	}
	this.map.on('click', this.mouseClick)
	this.map.on('mousemove', this.mouseMove)
	this.map.on('dblclick', this.mouseDbClick)
}
/* 清除测量结果 */
Measure.prototype.clear = function() {
	this.clearLine()
	this.clearArea()
}
/* 清除测量结果线 */
Measure.prototype.clearLine = function() {
	this.map.doubleClickZoom.enable();
	this.map.getCanvas().style.cursor = '';
	if (this.markers.length > 0) {
		this.markers.forEach(item => {
			item.remove()
		})
		this.markers = []
	}
	if (this.mouseClick) {
		this.map.off('click', this.mouseClick)
	}
	if (this.mouseMove) {
		this.map.off('mousemove', this.mouseMove)
	}
	if (this.mouseDbClick) {
		this.map.off('dblclick', this.mouseDbClick)
	}
	this.points = []
	this.jsonPoint.features = [];
	this.jsonLine.features = [];
	this.map.getSource('points-measure').setData(this.jsonPoint);
	this.map.getSource('line-measure').setData(this.jsonLine);
	this.map.getSource('line-move-measure').setData(this.jsonLine);
}
/* 清除测量结果面 */
Measure.prototype.clearArea = function() {
	this.map.doubleClickZoom.enable();
	this.elemoveArea.innerHTML =''
	this.tooltipArea.setLngLat([0, 0])
	this.map.getCanvas().style.cursor = '';
	if (this.markersArea.length > 0) {
		this.markersArea.forEach(item => {
			item.remove()
		})
		this.markersArea = []
	}
	if (this.mouseClick) {
		this.map.off('click', this.mouseClick)
	}
	if (this.mouseMove) {
		this.map.off('mousemove', this.mouseMove)
	}
	if (this.mouseDbClick) {
		this.map.off('dblclick', this.mouseDbClick)
	}
	this.pointsArea = []
	this.jsonPointArea.features = [];
	this.jsonLineArea.features = [];
	this.map.getSource('points-area').setData(this.jsonPointArea);
	this.map.getSource('line-area').setData(this.jsonLineArea);
	this.map.getSource('line-area-stroke').setData(this.jsonLineArea);
}
Measure.prototype.getLength = function(coords) {
	var _points = this.points.concat([coords]);
	var line = turf.lineString(_points);
	var len = turf.length(line);
	if (len < 1) {
		len = Math.round(len * 1000) + 'm';
	} else {
		len = len.toFixed(2) + 'km';
	}
	return len;
}
Measure.prototype.getArea = function(coords) {
	 var pts = this.pointsArea.concat([coords]);
	    pts = pts.concat([this.pointsArea[0]]);
	    var polygon = turf.polygon([pts]);
	    var area = turf.area(polygon);
	    if(area < 1000000) {
	      area = Math.round(area) + 'm²';
	    } else {
	      area = (area / 1000000).toFixed(2) + 'km²';
	    }
	    return area;
}
Measure.prototype.computeLength = function(wkt) {
	var line=window.Terraformer.WKT.parse(wkt)
	var len = turf.length(line);
	if (len < 1) {
		len = Math.round(len * 1000) + 'm';
	} else {
		len = len.toFixed(2) + 'km';
	}
	return len;
}
Measure.prototype.computeArea = function(wkt) {
	    var polygon  =window.Terraformer.WKT.parse(wkt)
	    var area = turf.area(polygon);
	    if(area < 1000000) {
	      area = Math.round(area) + 'm²';
	    } else {
	      area = (area / 1000000).toFixed(2) + 'km²';
	    }
	    return area;
}
export default Measure
