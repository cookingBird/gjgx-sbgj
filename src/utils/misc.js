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
  type = 'requestAnimationFrame',
  timer = 300
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
          }, timer)
        }
        if (type === 'requestIdleCallback') {
          requestIdleCallback(
            () => {
              getDom(id, callback, type)
            },
            { timeout: timer }
          )
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

export function pickFileds (target, ...fileds) {
  if (!target) return {}
  if (fileds.length === 0) return target
  const res = {}
  const f = fileds.flat()
  for (const key of f) {
    res[key] = target[key]
  }
  return res
}

export function arrayOmit (raw, omit, uniqueKey) {
  return raw.filter(
    pipe => omit.findIndex(p => p[uniqueKey] === pipe[uniqueKey]) === -1
  )
}

export function rawForEach (raws, picks, uniqueKey, cb) {
  picks.forEach(
    pipe => cb && cb(raws.find(p => p[uniqueKey] === pipe[uniqueKey]))
  )
}

export function rawMap (raws, picks, uniqueKey) {
  return picks.map(p => raws.find(raw => raw[uniqueKey] === p[uniqueKey]))
}

export function toArray (tar) {
  if (Array.isArray(tar)) {
    return tar
  } else {
    return [tar]
  }
}

export function getCtxValueSetter (ctx, filedString) {
  const fileds = filedString.split('.')
  const length = fileds.length
  return value => {
    let context = ctx
    fileds.forEach((val, index) => {
      if (index < length - 1) {
        context = context[val]
      } else {
        context[val] = value
      }
    })
  }
}
export function bindLoading (loadingFiled, loadingFn) {
  if (!loadingFn) {
    throw Error('bindLoading error, callback is null')
  }

  return function (...params) {
    const setValue = getCtxValueSetter(this, loadingFiled)
    setValue(true)
    try {
      return loadingFn(...params).then(
        res => {
          setValue(false)
          return res
        },
        err => {
          setValue(false)
          return Promise.reject(err)
        }
      )
    } catch (error) {
      setValue(false)
    }
  }
}

export function statisticFiled (array, Filed, resultType = 'array') {
  if (
    !Array.isArray(array) ||
    !Filed ||
    ['array', 'obj', 'object'].indexOf(resultType) === -1
  ) {
    throw Error('statisticFiled params error')
  }
  const isArray = resultType === 'array'
  return array.reduce(
    (pre, cur) => {
      const preVal = isArray
        ? pre.find(i => i[0] === cur[Filed])
        : pre[cur[Filed]]
      if (preVal) {
        if (isArray) {
          const preIndex = pre.findIndex(item => item[0] === cur[Filed])
          pre[preIndex][1].push(cur)
        } else {
          pre[cur[Filed]].push(cur)
        }
      } else {
        if (isArray) {
          pre.push([cur[Filed], [cur]])
        } else {
          pre[cur[Filed]] = [cur]
        }
      }
      return pre
    },
    isArray ? [] : {}
  )
}

export function isFiledValEqual (array, filed = 'id') {
  if (Array.isArray(array) && array.length > 0) {
    return array.slice(1).reduce(
      (pre, cur) => {
        if (cur[filed] === pre[0]) {
          return pre
        } else {
          return [false, false]
        }
      },
      [array[0][filed], true]
    )[1]
  } else {
    return false
  }
}

export function pickAttrs (obj, ...attrs) {
  attrs = attrs.flat()
  return attrs.reduce((pre, cur) => {
    return {
      ...pre,
      [cur]: obj[cur]
    }
  }, {})
}

export function pickDataAttrs (obj, ...attrs) {
  attrs = attrs.flat()
  return attrs.reduce((pre, cur) => {
    return {
      ...pre,
      [`data-${cur}`]: obj[cur]
    }
  }, {})
}
