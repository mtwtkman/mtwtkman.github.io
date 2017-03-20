var webpack = require('webpack');
var config = require('./base.js');

config.plugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
  })
];

module.exports = config
