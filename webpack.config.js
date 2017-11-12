import webpack from 'webpack'
import path from 'path'
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

let config = {
	output: {
		path: __dirname,
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	entry: ['babel-polyfill', './app','webpack-hot-middleware/client'],
	devtool: 'cheap-module-source-map',
	module: {
		rules: [{
					test: /\.jsx?$/,
					loader: 'babel-loader',
					include: [path.resolve(__dirname,'app')]
				},{
			        test: /\.scss$/,
			        use: ['style-loader','css-loader', 'sass-loader']
				},{
					test: /\.css$/,
					use: ['style-loader','css-loader']
				}]
	},
	plugins: [
    	// OccurenceOrderPlugin is needed for webpack 1.x only
	    new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoEmitOnErrorsPlugin()
	]
}

module.exports = config;