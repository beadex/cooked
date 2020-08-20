const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: "css/[name].bundle.css",
            chunkFilename: "css/[id].bundle.css",
        }),
    ],
    devServer: {
        host: "0.0.0.0",
        port: "5238",
        inline: true,
        hot: true,
        disableHostCheck: true,
        historyApiFallback: true,
        progress: true,
        publicPath: "/",
    },
});
