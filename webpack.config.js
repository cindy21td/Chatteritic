const path = require('path');
 
module.exports = {
  context: path.join(__dirname, 'src/'),
  entry: {
    javascript: './index.js',
  },
  output: {
    path: path.join(__dirname, 'public/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
};