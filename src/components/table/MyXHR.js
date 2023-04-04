const xhr = new XMLHttpRequest()
export function sendXhr (usrConfig) {
  const config = getConfig(usrConfig)
  let {
    timeout,
    headers,
    withCredentials,
    transformRequest,
    transformResponse,
    method,
    baseUrl,
    baseURL,
    url,
    data
  } = config
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      const response = {
        data: transformResponse.reduce(
          (pre, cur) => cur(pre, config),
          xhr.response
        ),
        config: config,
        headers: headers,
        status: xhr.status,
        statusText: xhr.statusText
      }
      resolve(response)
    }
    xhr.ontimeout = reject

    if (typeof method === 'string' && method.toLowerCase() === 'post') {
      xhr.open(method.toUpperCase(), combineURLs(baseUrl || baseURL, url), true)
      data = transformRequest.reduce((pre, cur) => cur(pre, headers), data)
    } else if (typeof method === 'string' && method.toLowerCase() === 'get') {
      xhr.open(method.toUpperCase(), buildGetUrl(config), true)
    } else {
      throw Error(`xmlRequest method not support ${method}`)
    }
    if (!data) {
      data = null
    }
    setHeader(xhr, headers)
    xhr.timeout = timeout
    //* 跨站点请求认证
    xhr.withCredentials = withCredentials
    xhr.send(data)
  })
}

export function createXHR (initConfig) {
  return {
    send: config => sendXhr(deepMerge(initConfig, config)),
    get: config => sendXhr(deepMerge(initConfig, config, { method: 'GET' })),
    post: config => sendXhr(deepMerge(initConfig, config, { method: 'POST' }))
  }
}

function getConfig (config) {
  const defaultConfig = {
    baseUrl: '',
    timeout: 3000,
    withCredentials: false,
    serializer: function (params) {
      const parts = []

      Object.entries(params).forEach(function serialize ([key, val]) {
        if (val === null || typeof val === 'undefined') {
          return
        }
        if (Array.isArray(val)) {
          key = key + '[]'
        } else {
          val = [val]
        }

        val.forEach(function parseValue (v) {
          if (kindOfTest('Date')(v)) {
            v = v.toISOString()
          } else if (typeof v === 'object') {
            v = JSON.stringify(v)
          }
          parts.push(encode(key) + '=' + encode(v))
        })
      })

      return parts.join('&')
    },
    method: 'GET',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      function (data, headers) {
        if (
          kindOfTest('FormData')(data) ||
          kindOfTest('ArrayBuffer')(data) ||
          kindOfTest('File')(data) ||
          kindOfTest('Blob')(data)
        ) {
          return data
        }
        const isObj = kindOfTest('object')(data)
        if (isObj && headers['Content-Type'] === 'multipart/form-data') {
          //* process form data
          if (kindOfTest('FileList')(data)) {
            //* process FileList
          } else {
            //* process normal form
          }
        } else if (isObj || headers['Content-Type'] === 'application/json') {
          return JSON.stringify(data)
        }
      }
    ],
    transformResponse: [
      function (response, config) {
        if (
          kindOfTest('string')(response) &&
          response.length &&
          config.responseType.toLowerCase() === 'json'
        ) {
          return JSON.parse(response)
        }
        return response
      }
    ]
  }
  return deepMerge(defaultConfig, config)
}

const kindOf = (function (cache) {
  const toString = Object.prototype.toString
  // eslint-disable-next-line func-names
  return function (thing) {
    const str = toString.call(thing)
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
  }
})(Object.create(null))

function kindOfTest (type) {
  type = type.toLowerCase()
  return function isKindOf (thing) {
    return kindOf(thing) === type
  }
}

function removeRepeat (array) {
  const res = {}
  array.forEach(f => (res[f] = void 0))
  return Object.keys(res)
}
function deepMerge (...targets) {
  function merge (source, target, isFirst = true) {
    const keys = removeRepeat(Object.keys(source).concat(Object.keys(target)))
    for (const key of keys) {
      if (
        Object.hasOwnProperty.call(target, key) &&
        Object.hasOwnProperty.call(source, key)
      ) {
        if (!kindOfTest(kindOf(source[key]))(target[key])) {
          console.warn(`deepMerge target ${key} type not satisfy with source `)
        } else {
          if (kindOfTest('array')(source[key])) {
            source[key].forEach((n, index) => {
              merge(n, target[key][index], false)
            })
          } else if (kindOfTest('object')(source[key])) {
            merge(source[key], target[key], false)
          } else {
            source[key] = target[key]
          }
        }
      } else {
        source[key] = source[key] || target[key] || null
      }
    }
    if (isFirst) {
      return source
    }
  }
  return targets.slice(1).reduce((pre, cur) => merge(pre, cur), targets[0])
}

function encode (val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function setHeader (xhr, header = {}) {
  for (const key in header) {
    if (Object.hasOwnProperty.call(header, key)) {
      xhr.setRequestHeader(
        key,
        kindOfTest('function')(header[key]) ? header[key]() : header[key]
      )
    }
  }
}
function combineURLs (baseURL, relativeURL) {
  return relativeURL
    ? relativeURL.startsWith('http')
      ? relativeURL
      : baseURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : relativeURL
    : Error('relativeURL do not exist')
}
function buildGetUrl (config) {
  function buildURL (url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url
    }

    let serializedParams = paramsSerializer(params)

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#')
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex)
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
  }
  return buildURL(
    combineURLs(config.baseUrl || config.baseURL, config.url),
    config.params,
    config.serializer
  )
}
