// http://www.cnblogs.com/erduyang/p/5617917.html

var webpack = require('webpack');
var production = process.env.NODE_ENV === 'production';
var CleanPlugin = require('clean-webpack-plugin');
var ExtractPlugin = require('extract-text-webpack-plugin');

var plugins = [new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    // Move dependencies to our main file
    children: true,
    // Look for common dependencies in all children,
    minChunks: 2,
    // How many times a dependency must come up before being extracted
}),];

if (production) {
    plugins = plugins.concat([
        // Production plugins go here

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200,
            // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false,
                // Suppress uglification warnings
            },
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        
        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('builds'),

        new ExtractPlugin('bundle.css'), // <=== where should content be piped
    ]);
}

module.exports = {
    debug: !production,
    devtool: production ? false : 'eval',
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/builds',
        filename: production ? '[name]-[hash].js': 'bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: 'builds/',//告诉Webpack在页面视图中去哪儿寻找构建了的资源（在我们的例子中就是 builds/）
    },
    module: {
        rules: [{
            test: /\.js/,
            loader: 'babel-loader',
            include: /src/
        }, {
            test: /\.scss/,
            //loader: 'style!css!sass',
            // Or
            // loaders: ['style', 'css', 'sass'] //过时写法
            use: [
                {
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: 'sass-loader'
                }
            ]
        }, {
            test: /\.html/,
            loader: 'html-loader'
        }]
    },
    plugins: plugins
};