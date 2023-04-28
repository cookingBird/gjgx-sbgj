import qs from "qs";
export default {
  install(axios) {
    axios.interceptors.request.use(repeatRemove);
  },
};

const record = new Map();
const DEFAULT_ABORT_TIME = window.URL_CONFIG.abortTimer || 1000;

function repeatRemove(config) {
  if (config.signal) return config;
  const identityFileds = Object.assign(
    {},
    pickFileds(config, "baseURL", "url", "method", "params", "data")
  );
  const identifier = qs.stringify(identityFileds);
  const isExist = record.has(identifier);
  const now = Date.now();
  const newController = new AbortController();
  //* process exist
  if (isExist) {
    const { createTime, controller } = record.get(identifier);
    const abortTimer = ((config.data && config.data.abortTimer)
      || (config.params && config.params.abortTimer)
      || DEFAULT_ABORT_TIME
    )
    if (now - createTime < abortTimer) {
      controller.abort();
    }
  }
  //* update controller
  record.set(identifier, { createTime: now, controller: newController });
  config.signal = newController.signal
  config.signal = newController.signal

  return config;
}

function pickFileds(obj, ...fileds) {
  fileds = fileds.flat();
  const res = {};
  for (const key in obj) {
    if (fileds.includes(key) && Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      res[key] = element;
    }
  }
  return res;
}
