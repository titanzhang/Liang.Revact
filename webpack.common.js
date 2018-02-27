const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
  	search: './src/client/Search.js'
  },

  output: {
    filename: 'js/[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'build')
  },

  plugins: [
    new CleanWebpackPlugin(['build'])
	],

	module: {
		rules: [
			{
        test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",
        query: {
          presets: ["es2015", "react"]
        }
      },
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
        	fallback: "style-loader",
        	use: "css-loader"
        })
      }
      // { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader?name=css/font/[name].[ext]'] },
      // { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader?name=css/img/[name].[ext]'] }
		]
	}
};
