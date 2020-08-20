const webpack = require("webpack");
const path = require("path");

const Analyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractText = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths.js");
const isProd = process.env.mode === "production";

module.exports = {
    entry: {
        main: path.resolve(__dirname, "../src/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: isProd ? "js/[name].[hash:8].js" : "js/[name].js",
        publicPath: "/",
        chunkFilename: "js/[name].chunk.js",
    },
    plugins: [
        new webpack.DefinePlugin({
            _DEV_: process.env.mode === "development",
        }),
        new webpack.ProvidePlugin({
            React: "react",
        }),
        new HTMLWebpackPlugin({
            favicon: path.resolve(__dirname, "../public/favicon.ico"),
            template: path.resolve(__dirname, "../public/index.html"),
            filename: "index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
        }),
        new Analyzer({
            openAnalyzer: false,
            analyzerMode: "static",
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx"],
        alias: paths,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: "image-webpack-loader",
                enforce: "pre",
            },
            {
                test: /\.(ico|jpg|jpeg|png|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "static/[name].[hash:8].[ext]",
                    },
                },
            },
            {
                test: /\.svg$/,
                use: {
                    loader: "svg-url-loader",
                    options: {
                        limit: 10 * 1024,
                        name: "static/[name].[hash:8].[ext]",
                        fallback: "file-loader",
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractText.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                ],
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    {
                        loader: MiniCssExtractText.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                        },
                    },
                ],
            },
        ],
    },
};
