module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: "module",
  },
  globals: {
    turf: true,
    mapboxgl: true,
    Cesium: true,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
