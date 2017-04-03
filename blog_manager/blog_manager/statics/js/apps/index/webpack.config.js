var path = require('path');

module.exports = {
  context: __dirname,
  entry: './entry',
  output: {
    path: path.resolve(__dirname, '../../dist/index'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../../node_modules'),
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              camelCase: true,
            },
          }
        ],
      },
    ]
  },
  devtool: 'inline-source-map',
}
