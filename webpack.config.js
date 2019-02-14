const path = require('path');

module.exports = {
  entry: './src/zdelib.js',
  output: {
    filename: 'zdelib.js',
    path: path.resolve(__dirname, 'dist')
  }
};
