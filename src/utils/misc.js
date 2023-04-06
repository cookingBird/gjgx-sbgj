export function removeRepeat (array, keyFile = id) {
  function validateFileds (source, target, fileds) {
    return fileds.reduce((pre, curF) => {
      return pre && source[curF] === target[curF]
    }, true)
  }
  return array.reduce((pre, curr) => {
    if (pre.findIndex(n => n[keyFile] === curr[keyFile]) > -1) {
      return pre
    } else {
      return pre.concat(curr)
    }
  }, [])
}

export function requestDom (
  id,
  judgeCb = el => Boolean(el),
  type = 'requestAnimationFrame'
) {
  function getDom (id, callback, type) {
    if (document && window && window.requestAnimationFrame) {
      const el =
        typeof id === 'string'
          ? document.getElementById(id)
          : Object.prototype.toString.call(id) === '[object Function]'
          ? id()
          : id
      if (!judgeCb(el)) {
        if (type === 'requestAnimationFrame') {
          requestAnimationFrame(() => {
            getDom(id, callback, type)
          })
        }
        if (type === 'setTimeout') {
          setTimeout(() => {
            getDom(id, callback, type)
          })
        }
      } else {
        return callback(el)
      }
    } else {
      throw Error("browser don't support")
    }
  }

  let resolver
  return new Promise(resolve => {
    resolver = resolve
    getDom(
      id,
      el => {
        setTimeout(() => {
          resolver(el)
        })
      },
      type
    )
  })
}
