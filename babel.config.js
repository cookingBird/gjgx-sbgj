module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [['transform-remove-console', { exclude: ['error'] }]]
  // include: ['src', 'pdfjs-dist/legacy/build/pdf']
}
