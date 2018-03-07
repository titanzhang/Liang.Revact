const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = merge(common, {
	devtool: 'inline-source-map',

  devServer: {
    contentBase: path.resolve(__dirname, '../build'),
    port: 3001
  },

  plugins: [
		new ExtractTextPlugin('css/[name].css'),
		new CleanWebpackPlugin(['../build'])
	]
});
