export default function () {
  return {
    methods: {
      /**@description 渲染所有管线 */
      async renderPipeLine (pipeList) {
        const mixMapRef = await this.syncMixMapLoaded()
        await mixMapRef.mapLoadReady()
        mixMapRef.pipeRender(pipeList)
      },
      /**
       * @description 渲染缓冲区
       * @param { * } pipe
       */
      renderRadius (pipe, mixMapRef = this.mixMapRef()) {
        const regionWkt = pipe.regionDto.regionWkt
        if (!this.__radiusRange) {
          this.__radiusRange = mixMapRef.pipeRadiusRender(regionWkt)
        } else {
          this.__radiusRange.update(regionWkt)
        }
      },
      /**
       * @description 渲染人居、特定场所、易燃易爆
       * @param {*} pipe
       */
      renderFeatures (pipe, mixMapRef = this.mixMapRef()) {
        const populationWkt = pipe.regionDto.populationWkt
        this.__populationLayer = mixMapRef.renderMarkerByType(
          populationWkt,
          'population'
        )
        const specificWkt = pipe.regionDto.specificWkt
        this.__placeLayer = mixMapRef.renderMarkerByType(
          specificWkt,
          'specific'
        )
        const flammableWkt = pipe.regionDto.flammableWkt
        this.__boomLayer = mixMapRef.renderMarkerByType(
          flammableWkt,
          'flammable'
        )
      },
      /**@description 渲染分段标识 */
      renderSegmentLabel (data) {
        const headerList = data
          .map(item => [item.firstPoint, item.lastPoint])
          .flat()
          .reduce((pre, cur) => {
            if (pre.find(wkt => wkt === cur)) {
              return pre
            } else {
              return pre.concat(cur)
            }
          }, [])
        const mixMapRef = this.mixMapRef()
        return mixMapRef.pipeSectionPointRender(headerList)
      },
      async renderLevel (data, field) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.sectionLevelRender(data, field)
      }
    }
  }
}
