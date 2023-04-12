// tailwind.config.js
const plugin = require('tailwindcss/plugin')
module.exports = {
  mode: 'jit',
  purge: ['./public/index.html', './src/**/*.{vue,js,css,scss}'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('el-input', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.el-input${e(`${separator}${className}`)} .el-input__inner`
        })
      })
    }),
    plugin(function ({ addVariant, e }) {
      addVariant('el-input:hover', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.el-input${e(`${separator}${className}`)} .el-input__inner:hover`
        })
      })
    })
  ]
}
