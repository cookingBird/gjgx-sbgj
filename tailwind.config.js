// tailwind.config.js
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
  plugins: []
}
