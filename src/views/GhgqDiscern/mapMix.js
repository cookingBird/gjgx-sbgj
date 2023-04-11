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
        if (!this.__populationLayer) {
          this.__populationLayer = mixMapRef.renderMarkerByType(
            populationWkt,
            'population'
          )
        } else {
          this.__populationLayer.update(populationWkt)
        }
        const specificWkt = pipe.regionDto.specificWkt
        if (!this.__placeLayer) {
          this.__placeLayer = mixMapRef.renderMarkerByType(
            specificWkt,
            'specific'
          )
        } else {
          this.__placeLayer.update(specificWkt)
        }
        const flammableWkt = pipe.regionDto.flammableWkt
        if (!this.__boomLayer) {
          this.__boomLayer = mixMapRef.renderMarkerByType(
            flammableWkt,
            'flammable'
          )
        } else {
          this.__boomLayer.update(flammableWkt)
        }
      },
      /**@description 渲染分段标识 */
      async renderSegmentLabel (data) {
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
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.pipeSectionPointRender(headerList)
      },
      async renderLevel (data) {
        const mixMapRef = await this.syncMixMapLoaded()
        mixMapRef.sectionLevelRender(data)
      }
    }
  }
}
