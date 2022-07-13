const { createConfig } = require("webpack-config-react");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = async (env, argv) => {
  const webpackConfig = await createConfig(
    argv.mode === "production" || env.production
  );
  return merge(webpackConfig, {
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
    ],
  });
};
