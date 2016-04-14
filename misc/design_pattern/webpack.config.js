module.exports = {
  context: __dirname + '/app',
  entry: './entry',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'app']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          compact: false
        }
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue'
      },
      {
        test: /\.md$/,
        loader: 'html!markdown-highlight'
      }
    ]
  },
  node: {
    fs: 'empty'
  }
}
