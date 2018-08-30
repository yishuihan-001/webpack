// webpack.config.js
// http://www.cnblogs.com/erduyang/p/5604000.html
const webpack = require('webpack');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/app.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist",//打包后的文件存放的地方
        filename: "app.bundle.js"//打包后输出文件的文件名
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    optimization: {
        minimizer: [
            new UglifyjsWebpackPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    }
}