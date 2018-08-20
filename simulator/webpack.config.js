const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/main.ts'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: path.resolve(__dirname, '../node_modules/'),
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, '../gui/assets/'),
    filename: 'simulator.js',
  },
}
