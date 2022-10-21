const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      { test: /\.css$/, use: 'css-loader' },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: 'index',
    globalObject: "this",
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
  },
};
