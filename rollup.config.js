import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  entry: 'index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ["es2015", { "modules": false }],
        "stage-2"
      ],
      plugins: ["external-helpers"]
    })
  ],
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
