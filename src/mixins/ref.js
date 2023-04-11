export default {
  provide () {
    return {
      getRef: key => this[key],
      setRef: (key, ctx) => (this[key] = ctx)
    }
  }
}
