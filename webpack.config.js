const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  console.log(env, argv.mode);
  const isDev = argv.mode === "development";
  return {
    output: {
      publicPath: isDev ? "/" : "/graph/",
      path: path.resolve(__dirname, "build"),
      filename: "[name]-[chunkhash].bundle.js",
      chunkFilename: "[name]-[chunkhash].js",
    },
    devServer: {
      historyApiFallback: true,
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
        {
          test: /\.(mkv|webm|webp|png|mp4|m4v)/,
          use: { loader: "file-loader" },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            sourceMap: true,
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
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
};
