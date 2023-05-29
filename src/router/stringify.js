import qs from 'qs';

export default {
  install(router) {
    router.beforeEach((to, from, next) => {
      console.log('before each to', to);
      console.log('before each from', from);
      const { fullPath, query } = to;
      // next({
      //   ...to,
      //   fullPath: fullPath.split('?')[0] + '?' + qs.stringify({ ...query, foo: { bar: 'this is bar' } })
      // })
      next()
    })
  }
}
