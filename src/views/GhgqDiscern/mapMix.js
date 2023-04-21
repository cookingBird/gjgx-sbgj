export default function () {
  return {
    methods: {
      /**@description 渲染所有管线 */
      renderPipeLine (pipeList, mixMapRef = this.mixMapRef()) {
        mixMapRef.pipeRender(pipeList)
      },
      /**
       * @description 渲染缓冲区
       * @param { * } pipe
       */
      renderRadius (pipe, mixMapRef = this.mixMapRef()) {
        const regionWkt = pipe.regionDto.regionWkt
        if (!this.__radiusRange) {
          this.__radiusRange = mixMapRef.pipeRadiusRender({ wkt: regionWkt })
        } else {
          this.__radiusRange.update(regionWkt)
        }
      },
      /**
       * @description 渲染人居、特定场所、易燃易爆
       * @param {*} pipe
       */
      renderFeatures (pipe, mixMapRef = this.mixMapRef()) {
        const populationWkt = pipe?.regionDto?.populationWkt || pipe
        this.__populationLayer = mixMapRef.renderMarkerByType(
          populationWkt,
          'population'
        )
        const specificWkt = pipe?.regionDto?.specificWkt || pipe
        this.__placeLayer = mixMapRef.renderMarkerByType(
          specificWkt,
          'specific'
        )
        const flammableWkt = pipe?.regionDto?.flammableWkt || pipe
        this.__boomLayer = mixMapRef.renderMarkerByType(
          flammableWkt,
          'flammable'
        )
      },
      renderFeatureByType (wkts, type, mapRef) {
        const populationWkt = wkts
        if (type === 'population') {
          this.__populationLayer = mapRef.renderMarkerByType(
            populationWkt,
            'population'
          )
        }
        const specificWkt = wkts
        if (type === 'specific') {
          this.__placeLayer = mapRef.renderMarkerByType(specificWkt, 'specific')
        }
        const flammableWkt = wkts
        if (type === 'flammable') {
          this.__boomLayer = mapRef.renderMarkerByType(
            flammableWkt,
            'flammable'
          )
        }
      },
      /**@description 渲染分段标识 */
      renderSegmentLabel (data, mixMapRef = this.mixMapRef()) {
        if (!data) return
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
        return mixMapRef.pipeSectionPointRender(headerList)
      },
      /**@description 渲染地区等级 */
      renderLevel (data, field, mixMapRef = this.mixMapRef(), colorMap = void 0) {
        return mixMapRef.sectionLevelRender(data, field, void 0, colorMap)
      }
    }
  }
}
