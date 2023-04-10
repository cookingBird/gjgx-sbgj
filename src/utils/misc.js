export function arrayDupRemove (array, ...keyFileds) {
  function validateFileds (source, target, fileds = keyFileds) {
    return fileds.reduce((pre, curF) => {
      return pre && source[curF] === target[curF]
    }, true)
  }
  return array.reduce((pre, curr) => {
    if (pre.findIndex(n => validateFileds(n, curr, keyFileds)) > -1) {
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
    if (document && window) {
      const el = typeof id === 'string' ? document.getElementById(id) : id()
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

  return new Promise(resolve => {
    getDom(id, resolve, type)
  })
}

export function getObjFileds (target, ...fileds) {
  if (!target) return {}
  if (fileds.length === 0) return target
  const res = {}
  for (const key of fileds) {
    res[key] = target[key]
  }
  return res
}
