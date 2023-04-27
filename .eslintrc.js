module.exports = {
  eslintIntegration: true,
  stylelintIntegration: true,
  printWidth: 90,
  singleQuote: true, //单引号
  useEditorConfig: true,
  tabWidth: 2,
  useTabs: false, //不使用tab换行
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
