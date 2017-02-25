var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'app'),
  entry: './entry',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules', 'app']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    })
  ]
}
