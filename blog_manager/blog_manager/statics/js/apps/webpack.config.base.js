var path = require('path');

module.exports = function(dir, name) {
  return {
    context: dir,
    entry: './entry',
    output: {
      path: path.resolve(dir, '../../dist/', name),
      filename: 'bundle.js',
    },
    resolve: {
      modules: [
        path.resolve(dir, '../../node_modules'),
        path.resolve(__dirname, 'components'),
      ],
      alias: {
        components: path.resolve(__dirname, 'components'),
      },
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
  };
}
