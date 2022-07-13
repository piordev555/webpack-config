const { createConfig } = require("webpack-config-react");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");

module.exports = async (env, argv) => {
  const isEnvProduction = argv.mode === "production" || env.production;
  const webpackConfig = await createConfig(isEnvProduction);
  return merge(webpackConfig, {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
          include: /\.module\.css$/,
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
          exclude: /\.module\.css$/,
        },
      ],
    },
    plugins: [].concat(
      isEnvProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "static/css/[name].[contenthash].css",
              chunkFilename: "static/css/[name].[contenthash].chunk.css",
            }),
          ]
        : []
    ),
  });
};
