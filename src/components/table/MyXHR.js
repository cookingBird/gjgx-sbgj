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

function deepMerge (...targets) {
  function merge (source, target, isFirst = true) {
    const keys = Object.keys(source).concat(Object.keys(target))
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
              deepMerge(n, target[key][index], false)
            })
          }
          if (kindOfTest('object')(source[key])) {
            deepMerge(source[key], target[key], false)
          }
          source[key] = target[key]
        }
      } else {
        source[key] = source[key] || target[key]
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

function getConfig (config) {
  const defaultConfig = {
    timeout: 3000,
    withCredentials: false,
    serializer: function (params) {
      const parts = []

      Object.entries(params).forEach(function serialize (key, val) {
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

function setHeader (xml, header = {}) {
  for (const key in header) {
    if (Object.hasOwnProperty.call(header, key)) {
      xml.setRequestHeader(key, header[key])
    }
  }
}
function combineURLs (baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
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
    combineURLs(config.baseURL, config.url),
    config.params,
    config.serializer
  )
}
const xml = new XMLHttpRequest()
export function sendXhr (config) {
  config = getConfig(config)
  let {
    timeout,
    headers,
    withCredentials,
    transformRequest,
    transformResponse,
    data
  } = config
  return new Promise((resolve, reject) => {
    xml.onload = () => {
      const response = {
        data: transformResponse.reduce(
          (pre, cur) => cur(pre, config),
          xml.response
        ),
        config: config,
        headers: headers,
        status: xml.status,
        statusText: xml.statusText,
        request: xml
      }
      resolve(response)
    }
    xml.ontimeout = reject
    //* 跨站点请求认证
    xhr.withCredentials = withCredentials
    xml.timeout = timeout
    setHeader(xml, headers)
    if (typeof method === 'string' && method.toLowerCase() === 'post') {
      xml.open(method.toUpperCase(), combineURLs(baseUrl, url), true)
      data = transformRequest.reduce((pre, cur) => cur(pre, headers), data)
    } else if (typeof method === 'string' && method.toLowerCase() === 'get') {
      xml.open(method.toUpperCase(), buildGetUrl(config), true)
    } else {
      throw Error(`xmlRequest method not support ${method}`)
    }
    if (!data) {
      data = null
    }
    xml.send(data)
  })
}

export function createXHR (initConfig) {
  return {
    send: config => sendXhr(deepMerge(config, initConfig)),
    get: config => sendXhr(deepMerge(config, initConfig, { method: 'GET' })),
    post: config => sendXhr(deepMerge(config, initConfig, { method: 'POST' }))
  }
}
