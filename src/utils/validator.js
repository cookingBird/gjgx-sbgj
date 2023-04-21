const _toString = Object.prototype.toString

export function isObject (t) {
  return _toString.call(t) === '[object Object]'
}


export function isArray(t){
  return Array.isArray(t)
}


export function isFunction(t){
  return _toString.call(t) === '[object Function]'
}
