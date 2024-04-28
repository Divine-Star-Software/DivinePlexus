const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  target: "web",
  output: {
    filename: "app.js",
    path: path.resolve("build/src/"),
    publicPath: "./",
  },
  externals: {
    //for steam
    "fs/promises": "commonjs fs/promises",
    electron: "commonjs electron",
    //for thread comm
    worker_threads: "commonjs worker_threads",
    perf_hooks: "commonjs perf_hooks",
    //for node web socket
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./src/tsconfig.json",
        extensions: [".ts", ".tsx", ".js", ".css"],
      }),
    ],
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compiler: "typescript",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(js|jsx)$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  watch: true,
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    port: 4201,
    https: true,
    static: {
      directory: path.join(__dirname, "static"),
      publicPath: "/",
    },
    /*     proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
      "/files": {
        target: "http://localhost:3000",
      },
    }, */
    liveReload: true,
    open: true,
    hot: true,
    watchFiles: [path.join(__dirname, "src/**/*")],
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
};
