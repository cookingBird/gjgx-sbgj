
function GeoLayer(map,id,islocation,geoJson,type) {
		this.map = map
		this.layerids=[id,id+'hover']
		this.type=type
		this.json=geoJson
		this.GeohoverEvent=null
		this.GeohoverOutEvent=null
		this.GeoSelectEvent=null
		if (islocation) {
			var bbox=turf.bbox(geoJson)
			this.map.fitBounds([bbox[0]-0.0045,bbox[1]-0.0045,bbox[2]+0.0045,bbox[3]+0.0045], {
				animate: false,
			})
		}
}
/* 移除几何要素图层点击事件 */
GeoLayer.prototype.removeGeoLayerSelectEvent = function() {
	if (this.GeoSelectEvent ) {
		this.map.off('click', this.layerids[0],this.GeoSelectEvent);
		this.GeoSelectEvent = null
		this.map.setFilter(this.layerids[1], ['in', 'id', '']);
	}
}
GeoLayer.prototype.addGeoLayerSelectEvent = function(callback) {
	var map = this.map
	if(this.GeoSelectEvent==null )
	{   
		this.GeohoverEvent = e => {
			var features = e.features		
			if (features && features.length > 0 && map.getLayer(features[0].layer.id + 'hover')) {
				if (callback) {
					callback({
						infos: features[0].properties,
						position: [e.lngLat.lng, e.lngLat.lat]
					})
				}
				map.setFilter(this.layerids[1], ['in', 'id', features[0].properties.id]);
			}
			else {
				if(callback)
				{
					callback(	)
				}
			}
		}
		map.on('click',this.layerids[0], this.GeohoverEvent);
	}
}
/* 移除几何要素图层移动事件 */
GeoLayer.prototype.removeGeoLayerHoverEvent = function() {
	if (this.GeohoverEvent || this.GeohoverOutEvent) {
		this.map.off('mouseenter', this.layerids[0],this.GeohoverEvent);
		this.map.off('mouseleave', this.layerids[0],this.GeohoverEvent);
		this.GeohoverEvent = null
		this.map.setFilter(this.layerids[1], ['in', 'id', '']);
	}
}
GeoLayer.prototype.addGeoLayerHoverEvent = function(callback) {
	var map = this.map
	if(this.GeohoverEvent==null  || this.GeohoverOutEvent==null)
	{   
		this.GeohoverEvent = e => {
			var features = e.features		
			if (features && features.length > 0 && map.getLayer(features[0].layer.id + 'hover')) {
				if (callback) {
					callback({
						infos: features[0].properties,
						position: [e.lngLat.lng, e.lngLat.lat]
					})
				}
				map.setFilter(this.layerids[1], ['in', 'id', features[0].properties.id]);
			}
			else {
				if(callback)
				{
					callback(	)
				}
			}
		}
		this.GeohoverOutEvent = () => {
			map.setFilter(this.layerids[1], ['in', 'id', '']);
			if(callback)
			{
				callback(	)
			}
		}
		map.on('mouseenter',this.layerids[0], this.GeohoverEvent);
		map.on('mouseleave',this.layerids[0], this.GeohoverOutEvent);
	}
}
GeoLayer.prototype.changeStyle = function(typevalue, value) {
	var type=this.type
	if(type=='point')
	{
		switch(typevalue)
		{
			case 'scale':
			this.map.setPaintProperty(this.layerids[0],'circle-radius',Number(value))
			this.map.setPaintProperty(this.layerids[0]+'hover','circle-radius',Number(value))
			break;
			
			case 'color':
			this.map.setPaintProperty(this.layerids[0],'circle-color',value)
			break;
			
			case 'position':
			this.json.geometry.coordinates=value;
			this.map.getSource(this.layerids[0]).setData(this.json);
			break;
		}
	}
	else if(type=='label')
	{   
		switch(typevalue)
		{
			case 'text':
			this.map.setLayoutProperty(this.layerids[0],'text-field',value)
			this.map.setPaintProperty(this.layerids[0]+'hover','text-field',value)
			break;
			
			case 'color':
			this.map.setPaintProperty(this.layerids[0],'text-color',value)
			break;
			
			case 'fontsize':
			this.map.setLayoutProperty(this.layerids[0],'text-size',value)
			this.map.setPaintProperty(this.layerids[0]+'hover','text-size',value)
			break;
			
			case 'font':
			this.map.setLayoutProperty(this.layerids[0],'text-font',value)
			this.map.setPaintProperty(this.layerids[0]+'hover','text-font',value)
			break
			
			case 'position':
			this.json.geometry.coordinates=value;
			this.map.getSource(this.layerids[0]).setData(this.json);
			break;
		}
	}
	else if(type=='polyline')
	{
		switch(typevalue)
		{
			case 'width':
			this.map.setPaintProperty(this.layerids[0],'line-width',Number(value))
			this.map.setPaintProperty(this.layerids[0]+'hover','line-width',Number(value))
			break;
			
			case 'color':
			this.map.setPaintProperty(this.layerids[0],'line-color',value)
			break
			
			case 'position':
			this.json.geometry.coordinates=value;
			this.map.getSource(this.layerids[0]).setData(this.json);
			break;
		}
	}
	else if(type=='polygon')
	{
		switch(typevalue)
		{   
			case 'alpha':
			this.map.setPaintProperty(this.layerids[0],'fill-opacity',value)
			this.map.setPaintProperty(this.layerids[0]+'hover','fill-opacity',value)
			break;
			
			case 'color':
			this.map.setPaintProperty(this.layerids[0],'fill-color',value)
			this.map.setPaintProperty(this.layerids[0]+'hover','fill-color',value)
			break
			
			case 'position':
			this.json.geometry.coordinates=value;
			this.map.getSource(this.layerids[0]).setData(this.json);
			break;

			case 'borderColor':
				this.map.setPaintProperty(this.layerids[0],'fill-outline-color',value);
				break;
		}
	}
	
}
export default GeoLayer
