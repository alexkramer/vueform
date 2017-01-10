import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  entry: 'index.js',
  plugins: [ babel() ],
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'VueValid'
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es'
    }
  ]
}
