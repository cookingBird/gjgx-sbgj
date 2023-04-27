export default {
  install(axios) {
    axios.interceptors.request.use(repeatRemove);
  },
};

const record = new Map();

function repeatRemove(config) {
  const identityFileds = Object.assign(
    {},
    pickFileds(config, "baseURL", "url", "method", "params", "data")
  );
  console.log("repeatRemove------------------", config);
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
