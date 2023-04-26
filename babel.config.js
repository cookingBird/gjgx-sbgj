module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins:
    process.env.NODE_ENV === 'development'
      ? []
      : [['transform-remove-console', { exclude: ['error'] }]]
  // include: ['src', 'pdfjs-dist/legacy/build/pdf']
}
