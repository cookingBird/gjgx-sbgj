import * as Validator from './validator'

export function validateFileds (source, target, ...fileds) {
  fileds = fileds.flat()
  return fileds.reduce((pre, curF) => {
    return pre && source[curF] === target[curF]
  }, true)
}

export function arrayDupRemove (array, ...keyFileds) {
  keyFileds = keyFileds.flat()
  return array.reduce((pre, curr) => {
    if (keyFileds.length) {
      if (pre.findIndex(n => validateFileds(n, curr, keyFileds)) > -1) {
        return pre
      } else {
        return pre.concat(curr)
      }
    } else {
      if (pre.include(curr)) {
        return pre
      } else {
        return pre.concat(curr)
      }
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
  const f = fileds.flat()
  if (f.length === 0) return target
  const res = {}
  for (const key of f) {
    res[key] = target[key]
  }
  return res
}

export function arrayOmit (array, omits, uniqueKey) {
  return array.filter(
    pipe => omits.findIndex(p => p[uniqueKey] === pipe[uniqueKey]) === -1
  )
}

export function rawForEach (raws, picks, uniqueKey, cb) {
  picks?.forEach(
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

export function getCtxValueSetter (ctx, filedLike) {
  const fileds = filedLike.split('.')
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

export function getCtxValue (ctx, filedLike) {
  const fileds = filedLike.split('.')
  let val = ctx
  fileds.forEach(key => {
    val = val[key]
  })
  return val
}

export function bindLoading (loadingFiled, loadingFn) {
  if (!loadingFn) {
    throw Error('bindLoading error, callback is null')
  }
  const setValue = getCtxValueSetter(this, loadingFiled)
  return (...params) => {
    try {
      setValue(true)
      const result = loadingFn.bind(this)(...params)
      if (!result.then) {
        throw Error('bindLoading must return a promise')
      }
      return result.then(
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
      console.log('exec loading error', error)
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

export function reduceFiledEqual (array, filed = 'id') {
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

export function pickAttrs (obj, prefix = val => val, ...attrs) {
  attrs = attrs.flat()
  return attrs.reduce((pre, cur) => {
    return {
      ...pre,
      [prefix(cur)]: obj[cur]
    }
  }, {})
}

export function pickDataAttrs (obj, ...attrs) {
  return pickAttrs(obj, key => 'data-' + key, attrs)
}

export function statisticArray (array, sFiled = 'id') {
  return array.reduce((pre, curr) => {
    const fVal = curr[sFiled]
    return {
      ...pre,
      [fVal]: pre[fVal] ? pre[fVal].concat(curr) : [curr]
    }
  }, {})
}

export function debounce (fn, timeGutter = 300, immediate = false) {
  let timer
  return function (...params) {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...params)
        timer = void 0
      }, timeGutter)
      if (immediate) {
        fn(...params)
      }
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn(...params)
        timer = null
      })
    }
  }
}

/**
 * !警告,该函数的回调不可打印执行
 * @description
 * @param {*} mergeFiled
 * @param {*} statisticKey
 * @returns
 */
export function createTableSpanMethods (mergeFiled, statisticKey) {
  let mergeRecord = null
  let mergeRecordClear = null
  let mergeStatistic = null
  let mergeStatisticClear = null
  statisticKey = statisticKey || mergeFiled
  const isA = Array.isArray(mergeFiled)
  if (!isA) {
    return function (scope, tableData) {
      const { row, column } = scope

      if (!mergeRecord) {
        mergeRecord = {}
        mergeRecordClear = debounce(() => {
          mergeRecord = null
        }, 1000)
      } else {
        mergeRecordClear()
      }

      if (!mergeStatistic) {
        mergeStatistic = statisticArray(tableData, statisticKey)
        mergeStatisticClear = debounce(() => {
          mergeStatistic = null
        }, 1000)
      } else {
        mergeStatisticClear()
      }
      if (column.property === mergeFiled) {
        if (!mergeRecord[row[statisticKey]]) {
          mergeRecord[row[statisticKey]] = true
          return {
            rowspan: mergeStatistic[row[statisticKey]].length,
            colspan: 1
          }
        } else {
          return {}
        }
      }
    }
  } else {
    return function (scope, tableData) {
      const { row, column } = scope
      if (!mergeRecord) {
        mergeRecord = {}
        mergeRecordClear = debounce(() => {
          mergeRecord = null
        }, 1000)
      } else {
        mergeRecordClear()
      }

      if (!mergeStatistic) {
        mergeStatistic = statisticArray(tableData, statisticKey)
        mergeStatisticClear = debounce(() => {
          mergeStatistic = null
        }, 1000)
      } else {
        mergeStatisticClear()
      }
      if (mergeFiled.includes(column.property)) {
        if (
          !mergeRecord[row[statisticKey]] ||
          !mergeRecord[row[statisticKey]].includes(column.property)
        ) {
          if (!mergeRecord[row[statisticKey]]) {
            mergeRecord[row[statisticKey]] = [column.property]
          } else {
            mergeRecord[row[statisticKey]].push(column.property)
          }
          return {
            rowspan: mergeStatistic[row[statisticKey]].length,
            colspan: 1
          }
        } else {
          return {}
        }
      }
    }
  }
}

export function createFiledRecordCtx (fallback, filedKey) {
  const ctx = {}
  if (typeof fallback === 'string') {
    switch (fallback) {
      case 'randomColor': {
        fallback = randomColor
        break
      }
    }
  }
  return function (filedOrItem, isGetCtx = false) {
    if (isGetCtx) {
      return ctx
    }
    if (!filedKey) {
      if (!ctx[filedOrItem]) {
        ctx[filedOrItem] = fallback()
        return ctx[filedOrItem]
      } else {
        return ctx[filedOrItem]
      }
    } else {
      if (!ctx[filedOrItem[filedKey]]) {
        ctx[filedOrItem[filedKey]] = fallback()
        return ctx[filedOrItem[filedKey]]
      } else {
        return ctx[filedOrItem[filedKey]]
      }
    }
  }
}

export function randomColor () {
  return (
    '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  )
}

export function mergeFiled (array, filedLike) {
  return array.map(item => getCtxValue(item, filedLike)).flat()
}

export function createArrayContrast (raw, ...contrastFiled) {
  let history = raw || []
  contrastFiled = contrastFiled.flat()
  return function contrast (curr) {
    const isAdd = curr.length > history.length
    let list = []
    if (isAdd) {
      list = curr.filter(
        cur =>
          history.findIndex(his => validateFileds(cur, his, contrastFiled)) ===
          -1
      )
    } else {
      list = history.filter(
        cur =>
          curr.findIndex(his => validateFileds(cur, his, contrastFiled)) === -1
      )
    }
    history = curr
    return {
      isAdd: isAdd,
      list: list
    }
  }
}

export function getTreeTravels (visitor, childrenKey = 'children') {
  const { firstEnter, every } = visitor || {}
  return target => {
    function travel (tar, isFirst = true) {
      if (isFirst) {
        firstEnter && firstEnter(tar)
      }
      if (Object.prototype.toString.call(tar) === '[object Object]') {
        every && every(tar)
        if (tar[childrenKey] && tar[childrenKey].length) {
          travel(tar[childrenKey], false)
        }
      }
      if (Object.prototype.toString.call(tar) === '[object Array]') {
        tar.forEach(element => {
          travel(element, false)
        })
      }
    }
    travel(target)
  }
}

export function getObjTravels (visitor, maxDepth = 3) {
  const { every } = visitor || {}
  return target => {
    const result = {}
    function travel (object, res, depth = 1) {
      if (depth < maxDepth) {
        for (const key in object) {
          const isTravel = every && every(key, object[key], res)
          const tar = object[key]
          if (
            Object.prototype.toString.call(tar) === '[object Object]' &&
            isTravel &&
            depth < maxDepth
          ) {
            res[key] = res[key] || {}
            travel(tar, res[key], depth + 1)
          }
          if (
            Object.prototype.toString.call(tar) === '[object Array]' &&
            isTravel &&
            depth < maxDepth
          ) {
            res[key] = res[key] || []
            tar.forEach(element => {
              travel(element, res[key], depth + 1)
            })
          }
        }
      }
    }
    travel(target, result)
    return result
  }
}

export function downloadURL (url, name = '默认名称') {
  const link = document.createElement('a')
  link.download = name
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function forIn (obj, cb) {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key]
      cb && cb(key, element)
    }
  }
}
