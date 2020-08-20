const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                },
                styles: {
                    test: /\.css$/,
                    name: "styles",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[id].[hash].css",
        }),
        new PurgecssPlugin({
            paths: glob.sync(path.resolve(__dirname, "../src/**/*"), { nodir: true }),
        }),
    ],
});
