const http = require('http')
const fs = require('fs')
const path = require('path')

const transformRequest = [['/permission/getPermission', transPermission]]
const reqLog = getObjectTraveler(
  {
    every (key, value, result) {
      if (typeof value !== 'object') {
        result[key] = value
      }
      return !['socket', 'rawHeaders'].includes(key)
    }
  },
  5
)
module.exports = function (req, res) {
  // console.log('dataTransform- path-----------\n', req.path)
  // console.log('dataTransform- url-----------\n', req.url)
  // console.log('dataTransform- baseUrl-----------\n', req.baseUrl)
  // console.log('dataTransform- params-----------\n', req.params)
  // console.log('dataTransform- query-----------\n', req.query)
  // console.log('dataTransform- method-----------\n', req.method)
  // console.log('dataTransform- headers-----------\n', req.headers)
  try {
    fs.writeFile(
      path.resolve(
        __dirname,
        `./log/request/${new Date(Date.now())
          .toLocaleString()
          .split(' ')[0]
          .split('/')
          .join('-')}.json`
      ),
      JSON.stringify(reqLog(req)),
      error => {
        if (error) {
          console.log('error--------------\n', error)
        }
      }
    )
    return req.path
  } catch (e) {}

  // http.request({
  //   path:req.path,
  //   port:req.port,
  //   method:req.method,
  //   headers:req.headers
  // },response => res.send(response))
  // if (transformRequest.find(item => req.path.includes(item[0])) || true) {
  //   const responseTransform = transPermission;
  //   // const responseTransform = transformRequest.find(item =>
  //   //   req.path.includes(item[0])
  //   // )[1] || transPermission;
  //   http.request(req, response => {
  //     res.send(responseTransform(response))

  //   })
  // }
}

function transPermission (response) {
  console.log(
    'transPermission------------------------------------------\n',
    response,
    '++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n'
  )
  return response
}

function getObjectTraveler (visitor, maxDepth = 3) {
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
