const srcFiles = [
  /src/
]

module.exports = {

  /**
   * You can read this like:
   *   make this: out of this
   */
  entry: {
    './build/js/bundle.js': './src/js/index.js'
  },

  output: { filename: '[name]' },

  /**
   * Source maps
   */
  devtool: 'cheap-module-eval-source-map',

  module: {
    loaders: [

      /**
       * Run the babel loader on all your src .js files.
       */
      { test: /\.js$/, include: srcFiles, loaders: ['babel'] }

    ]
  }

}
