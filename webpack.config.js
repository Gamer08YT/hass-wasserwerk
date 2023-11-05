const path = require("path");
const glob = require("enhanced-resolve");
const fs = require("fs");
const fileNames = fs.readdirSync('./src').reduce((acc, v) => ({...acc, [v]: `./src/${v}`}), {});
const webpack = require("webpack");
const loader = require("ts-loader");

module.exports = {
    entry: fileNames,
    mode: "production",
    optimization: {
        minimize: false
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        esModule: false
                    }
                }
            },
            {parser: {amd: false}},
            {
                test: /\.css$/,
                use: [{
                    loader: 'css-loader',
                    options: {
                        esModule: false
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: Infinity,  // Dies garantiert, dass alle Bilder, unabhängig vom Dateivolumen, als Base64-kodierte Strings eingebettet werden
                            name: '[name].[hash:7].[ext]',
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        },
        alias: {
            'jquery-ui': 'jqueryui/jquery-ui.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ],
    output: {
        library: "WasserwerkCard",
        libraryTarget: "umd",
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    externals: {
        './hacs.js': 'hacs', // Der Pfad zur separaten Datei und der Name, unter dem sie als externer Code referenziert wird
    },
};