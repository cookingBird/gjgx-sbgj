
function Pop(map,pop, id) {
	this.map=map
	this.pop=pop
	this.id=id
}
/* 注册关闭前事件 */
Pop.prototype.addCloseEvent = function(callback) {
	this.pop.on("close",(e)=>{
		if(callback)
		{
			callback()
		}
	})
}
/* 改变pop位置 */
Pop.prototype.setPositions = function(positions) {
	if(!positions || positions.length!=2)
	{
		return
	}
	this.pop.setLngLat(positions)
}
export default Pop
