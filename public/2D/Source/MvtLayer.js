import Ajax from "./Ajax.js"

function MvtLayer(map, url, id,callback,key) {
	var serviceUrl=url + '/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true&tileURLTemplate=ZXY'
	if(key)
	{
		serviceUrl=url + '/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true&tileURLTemplate=ZXY&key='+ key
	}
	Ajax.get(serviceUrl, style => {
		
		var styleMvt = JSON.parse(style)
		this.map = map
		this.map.addStyle(styleMvt)
		this.id = id
		this.sourceid = styleMvt.name
		this.layerids=[]
		this.options={
			clickEvent:null,
			layersids:[],
			selectlayer:null
		}
		setTimeout ( () => {
			var layers = this.map.getStyle().layers
			layers.forEach(item => {
				if (item.type && item.source == this.sourceid) {
					this.layerids.push(item.id)
					switch (item.type) {
						case 'symbol':
					      if(item.layout)
						  {
							  if(item.layout['icon-size'])
							  {   
								 var paint={}
								if(item.paint)
								{
									paint=JSON.parse(JSON.stringify(item.paint))
									paint['text-color']='rgba(0,0,255,0.6)'
									paint['text-halo-color']="rgba(255, 255, 255, 1.0)"
								}
							  	var layout=JSON.parse(JSON.stringify(item.layout))
							  	layout['icon-size']+=0.2
							  	layout.visibility='visible'
							  	this.map.addLayer({
							  		"id": item.id + 'hovermvt',
							  		"maxzoom":item.maxzoom,
							  		"minzoom":item.minzoom,
							  		"metadata":JSON.parse(JSON.stringify(item.metadata)),
							  		"type": "symbol",
							  		"source": item.source,
							  		"paint":paint,
							  		"source-layer": item['source-layer'],
							  		"layout": layout,
							  		'filter': ['in', 'ID', ''],
							  	});
							  }
							  else 
							  {
							  	if(item.paint)
							  	{    
							  		var paint=JSON.parse(JSON.stringify(item.paint))  
							  		paint['text-color']='rgba(0,0,255,0.6)'
									paint['text-halo-color']="rgba(255, 255, 255, 1.0)"
							  		var layout=JSON.parse(JSON.stringify(item.layout))
							  		layout.visibility='visible'
							  		this.map.addLayer({
							  			"id": item.id + 'hovermvt',
							  			"type": "symbol",
							  			"source": item.source,
							  			"maxzoom":item.maxzoom,
							  			"minzoom":item.minzoom,
							  			"metadata":JSON.parse(JSON.stringify(item.metadata)),
							  			"paint":paint,
							  			"source-layer": item['source-layer'],
							  			"layout": layout,
							  			'filter': ['in', 'ID', ''],
							  
							  		});
							  	}
							  }	
						  }
						  else {
							  var paint=JSON.parse(JSON.stringify(item.paint))
							  paint['text-color']='rgba(0,0,255,0.6)'
							  paint['text-halo-color']="rgba(255, 255, 255, 1.0)"
							  var layout=JSON.parse(JSON.stringify(item.layout))
							  layout.visibility='visible'
							  this.map.addLayer({
							  	"id": item.id + 'hovermvt',
							  	"type": "symbol",
							  	"source": item.source,
							  	"maxzoom":item.maxzoom,
							  	"minzoom":item.minzoom,
							  	"metadata":JSON.parse(JSON.stringify(item.metadata)),
							  	"paint":paint,
							  	"source-layer": item['source-layer'],
							  	"layout": layout,
							  	'filter': ['in', 'ID', ''],
							  							  
							  });
						  }
						       								
                        break;
						case 'line':
							this.map.addLayer({
								"id": item.id + 'hovermvt',
								"type": "line",
								"source": item.source,
								"source-layer": item['source-layer'],
								"maxzoom":item.maxzoom,
								"minzoom":item.minzoom,
								"metadata":JSON.parse(JSON.stringify(item.metadata)),
								"paint": {
									"line-color": 'rgba(0,0,255,0.6)',
									"line-width": item.paint['line-width'] + 0.2,

								},
								'filter': ['in', 'ID', ''],
							});
							break;

						case 'fill':
							this.map.addLayer({
								"id": item.id + 'hovermvt',
								"type": "fill",
								"source": item.source,
								"maxzoom":item.maxzoom,
								"minzoom":item.minzoom,
								"metadata":JSON.parse(JSON.stringify(item.metadata)),
								"source-layer": item['source-layer'],
								"paint": {
									"fill-color": 'rgba(0,0,255,0.6)'
								},
								'filter': ['in', 'ID', ''],
							});
							break;
					}
				}
			})
			if (callback) {
				callback(
				   
					this.layerids
							
				)
			}
			var layersAdded = this.map.getStyle().layers
			layersAdded.forEach(item => {
				if (item.source == this.sourceid) {
					this.options.layersids.push(item.id)
				}
			})		
		},500)
	})
}
//加载完成后回调
function mapService(map, url) {
	var getMapStatusService = new SuperMap.MapService(url, {
		serverType: SuperMap.ServerType.ISERVER,
		eventListeners: {
			processCompleted: function(serviceResult) {
				var result = serviceResult.result;
				var x = result.center.x
				var y = result.center.y
				map.setCenter([x, y])
			}
		},
	});
	getMapStatusService.processAsync();
}
/* 增加mvt弹窗关闭后关闭高亮的选择 */
MvtLayer.prototype.closedHighLight = function() {
	var map = this.map
	if (this.options && this.options.selectlayer) {
			map.setFilter(this.options.selectlayer, ['in', 'ID', '']);
			this.options.selectlayer = null
	}
}
MvtLayer.prototype.setSelection = function(layerid,key,value) {
	this.options.selectlayer = layerid+'hovermvt'
	this.map.setFilter(this.options.selectlayer, ['in', key,value]);
}
/* 设置图层点击事件 */
MvtLayer.prototype.addSelectEvent = function(callback) {
	var map=this.map
	this.options.clickEvent= e=> {
		var bbox = [
			[e.point.x - 5, e.point.y - 5],
			[e.point.x + 5, e.point.y + 5]
		];
		var features = map.queryRenderedFeatures(bbox, {});
		var properties = features.length ? features[0].properties : {};
		if (this.options.selectlayer) {
			map.setFilter(this.options.selectlayer, ['in', 'ID', '']);
			this.options.selectlayer = null
		}
		if (features && features.length > 0 &&map.getLayer(features[0].layer.id + 'hovermvt')) {
			//判断不是geometry图层
			if(callback && properties._type !== 'geometryLayer')
			{
				callback(
				{   
					position:[e.lngLat.lng,e.lngLat.lat],
					infos:properties,
					layerid:properties
				}			
				)
			}
			
			this.options.selectlayer = features[0].layer.id + 'hovermvt'
			map.setFilter(this.options.selectlayer, ['in', 'ID',features[0].properties.ID]);
		}
	}
	map.on('click', this.options.clickEvent);
}
/* 移除图层点击事件 */
MvtLayer.prototype.removeSelectEvent = function() {
	if(this.options.clickEvent)
	{
		this.map.off('click', this.options.clickEvent);
		this.options.clickEvent=null
		if (this.options.selectlayer) {
			this.map.setFilter(this.options.selectlayer, ['in', 'ID', '']);
			this.options.selectlayer = null
		}
	}
}
/* 设置mvt子图层显隐,layerid为子图层名称,isvisible为bool值 */
MvtLayer.prototype.setChildVisible = function(layerid, isvisible) {
	if (!layerid) {
		return
	}
	var visible
	if (isvisible) {
		visible = 'visible'
	} else {
		visible = 'none'
	}
	this.map.setLayoutProperty(layerid, 'visibility', visible)
}
/* 设置mvt过滤条件,layerid为子图层名称,filter为一个符合mapbox的style中filter规范的过滤器参数对象 例如设置过滤条件只显示图层中ID=1的要素
                mvtMap.setFilter(id, ["in", "$id", 1]) */
MvtLayer.prototype.setFilter = function(layerid, name, values) {
	if (!layerid) {
		return
	}
	this.map.setFilter(layerid, ["in", name].concat(values));
}
/* 移除mvt过滤*/
MvtLayer.prototype.removeLayerFilter = function(layerid) {
	if (!layerid) {
		return
	}
	this.map.setFilter(layerid, null);
}
/* 设置mvt图层,layerid为子图层名称,name风格名称,value对应风格值对象  例如 mvtMap.setPaintProperty(id, "line-color", "rgba(255,0,0,1.00)"); 
 fill-color  line-width
*/
MvtLayer.prototype.setPaintProperty = function(layerId, name, value,callback) {
	if (!layerId || !name ||!value) {
		return
	}
	if(callback)
	{
	   callback(this.map.getPaintProperty(layerId,name))	
	}
	this.map.setPaintProperty(layerId, name, value)
}
export default MvtLayer
