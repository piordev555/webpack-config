const { createConfig } = require("webpack-config-react");

module.exports = async (env, argv) => {
  return createConfig(argv.mode === "production" || env.production);
};
