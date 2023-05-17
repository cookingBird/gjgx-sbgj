import { getTreeTraveler } from '@/utils/misc';
import { IFRAME_SRC_URL, IFRAME_TAR_URL } from "@/config";

export default {
  install(axios) {
    //开发环境本地地址转换
    if (process.env.NODE_ENV === 'development') {
      axios.interceptors.response.use(transform)
    }
  }
}


const funTransform = getTreeTraveler({
  every(node) {
    if (node.reqPath) {
      node.reqPath = node.reqPath.replace(IFRAME_SRC_URL, IFRAME_TAR_URL)
    }
  }
})

function transform(response) {
  const { data, code } = response
  if (code === 200 && data?.fun) {
    data.fun.forEach(element => {
      funTransform(element)
    })
  }
  return response
}
