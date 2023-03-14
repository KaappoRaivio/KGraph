const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]-[chunkhash].bundle.js",
    chunkFilename: "[name]-[chunkhash].js",
  },
  resolve: {
    extensions: [".js", ".jsx", "ts", "tsx"],
    modules: [path.join(__dirname, "src"), "node_modules", path.join(__dirname, "res")],
    alias: {
      react: path.join(__dirname, "node_modules", "react"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: { loader: "svg-inline-loader" },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "shared",
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor",
    //   minChunks: ({ resource }) => resource !== undefined && resource.indexOf("node_modules") !== -1,
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "manifest",
    //   minChunks: Infinity,
    // }),
  ],
};
