const path = require('path');
const combineLoaders = require('webpack-combine-loaders');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: '/dist',
        publicPath: '/',
        filename: 'bundle-[hash].js'
    },
    devtool: 'source-map',
    devServer: {
        publicPath: '/',
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        modules: [
            './node_modules',
            './src'
        ],
        alias: {
            prosemirror: 'prosemirror/dist'
        }
    },
    resolveLoader: {
        modules: ['./node_modules', './src']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: [
                'react-hot-loader/webpack',
                'babel-loader'
            ],
            include: [
                path.join(__dirname, 'src')
            ]
        }, {
            test: /\.svg/,
            loader: 'url-loader?limit=100000'
        }, {
            test: /\.css$/,
            loader: combineLoaders([
                {
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    query: {
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                }
            ])
        }, {
            test: /\.scss$/,
            use: [{
                loader: 'style-loader' // creates style nodes from JS strings
            }, {
                loader: 'css-loader', // translates CSS into CommonJS
                options: {
                    modules: true,
                    sourceMap: true,
                    importLoaders: 2,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            }, {
                loader: 'sass-loader' // compiles Sass to CSS
            }]
        }, {
            test: /\.(png|jp(e*)g|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[hash]-[name].[ext]'
                }
            }]
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'url-loader?name=/fonts/[name].[ext]'
        }]
    }
};