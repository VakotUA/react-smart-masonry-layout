const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('rollup-plugin-postcss')

module.exports = {
  rollup(config) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: true,
      })
    )

    return config
  },
}
