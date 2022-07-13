const { createConfig } = require("webpack-config-react");
const { merge } = require("webpack-merge");

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  type: "asset/resource",
};

module.exports = async (env, argv) => {
  const webpackConfig = await createConfig(
    argv.mode === "production" || env.production
  );
  return merge(webpackConfig, {
    module: {
      rules: [imageLoaderConfiguration],
    },
    resolve: {
      alias: {
        "react-native$": "react-native-web",
      },
    },
  });
};
