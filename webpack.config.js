

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    'index':'./src/index.js',
    'forminputs': './src/forminputvalue.js',
    'createcard': './src/createcardmodule.js',
 
},
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
    clean: true
  },

  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 

  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'

    }),
],


};