var webpack = require('webpack');

module.exports = {
  context: __dirname + '/app',
  entry: './entry',
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    path: 'empty'
  }
}
