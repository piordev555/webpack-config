import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import fs from "fs-extra";
import HtmlWebpackPlugin from "html-webpack-plugin";
import kleur from "kleur";
import { createRequire } from "module";
import path from "path";
import webpackMerge from "webpack-merge";
import dirnameCompat from "./dirname.cjs";

const { _dirname } = dirnameCompat;
const { merge } = webpackMerge;
const appDirectory = fs.realpathSync(process.cwd());

const log = (msg) =>
  console.log(`${kleur.bold("[webpack-config-react]")} ${msg}`);

const error = (msg) => {
  console.error(`${kleur.bold("[webpack-config-react]")} ${msg}`);
  process.exit(1);
};

const __require = createRequire(_dirname);
const importModule = (id) => __require(id);
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const resolveNode = (filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveApp(`${filePath}.${extension}`))
  );
  if (extension) {
    return resolveApp(`${filePath}.${extension}`);
  }
  return resolveApp(`${filePath}.js`);
};

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const defaultOptions = {
  moduleFileExtensions,
  pathHtml: resolveApp("./public/index.html"),
  pathBuild: resolveApp("build"),
  pathPublic: resolveApp("public"),
  pathEntry: resolveNode("./src/index"),
  pathSrc: resolveApp("src"),
};

const isJSONFile = (filePath) => {
  const jsonExts = [".json", "rc"];
  for (const jsonExt of jsonExts) {
    if (filePath.endsWith(jsonExt)) return true;
  }
  return false;
};

const getConfig = (configFiles) => {
  for (const configFile of configFiles) {
    const configFilePath = path.resolve(appDirectory, configFile);
    if (fs.existsSync(configFilePath)) {
      return [
        configFilePath,
        isJSONFile(configFilePath)
          ? JSON.parse(fs.readFileSync(configFilePath))
          : importModule(configFilePath),
      ];
    }
  }
};

const getBabelConfig = () => {
  const babelConfig = getConfig([
    ".babelrc",
    ".babelrc.json",
    ".babelrc.js",
    ".babelrc.mjs",
    ".babelrc.cjs",
    "babel.config.js",
    "babel.config.json",
    "babel.config.mjs",
    "babel.config.cjs",
  ]);
  if (babelConfig) {
    log(`Load babel config from ${babelConfig[0]}`);
    return babelConfig[1];
  }
};

const getSwcConfig = () => {
  const swcConfig = getConfig([".swcrc"]);
  if (swcConfig) {
    log(`Load swc config from ${swcConfig[0]}`);
    return swcConfig[1];
  }
};

const templatePathHtml = path.resolve(_dirname, "./templates/index.html");
const templatePathEntry = path.resolve(_dirname, "./templates/index.js");

/**
 *
 * @param {*} env
 * @param {typeof defaultOptions} options
 * @returns {import('webpack').Configuration}
 */
export const createConfig = async (isEnvProduction, options) => {
  const {
    moduleFileExtensions,
    pathHtml,
    pathBuild,
    pathSrc,
    pathEntry,
    pathPublic,
  } = Object.assign(defaultOptions, options);

  log(
    `Use ${
      isEnvProduction
        ? `${kleur.green("production")}`
        : `${kleur.yellow("development")}`
    } webpack configuration.`
  );

  let loader;

  let babelConfig = getBabelConfig();
  let swcConfig = !babelConfig ? getSwcConfig() : undefined;

  if (!babelConfig && !swcConfig) {
    error("Either babel or swc configuration file must be present");
  }

  if (babelConfig) {
    if (!isEnvProduction) {
      babelConfig = merge(babelConfig, {
        plugins: ["react-refresh/babel"],
      });
    }
    loader = ["babel-loader", babelConfig];
  } else {
    if (!isEnvProduction) {
      swcConfig = merge(swcConfig, {
        jsc: {
          transform: {
            react: {
              development: !isEnvProduction,
              refresh: true,
            },
          },
        },
      });
    }
    loader = ["swc-loader", swcConfig];
  }

  if (!fs.existsSync(pathHtml)) {
    log(`${pathHtml} is not found. Creating one.`);
    fs.copySync(templatePathHtml, pathHtml);
  }

  if (!fs.existsSync(pathEntry)) {
    log(`${pathEntry} is not found. Creating one.`);
    fs.copySync(templatePathEntry, pathEntry);
  }

  return {
    devServer: {
      hot: true,
      static: { directory: pathPublic },
      historyApiFallback: true,
    },
    optimization: {
      splitChunks: isEnvProduction
        ? {
            chunks: "all",
            cacheGroups: {
              default: false,
              defaultVendors: false,
              framework: {
                chunks: "all",
                name: "framework",
                test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                priority: 40,
                enforce: true,
              },
            },
          }
        : undefined,
      runtimeChunk: { name: "webpack" },
      minimize: isEnvProduction,
    },
    entry: pathEntry,
    mode: isEnvProduction ? "production" : "development",
    bail: isEnvProduction,
    output: {
      path: pathBuild,
      publicPath: "/",
      pathinfo: !isEnvProduction,
      filename: "static/js/[name].[contenthash].js",
      chunkFilename: "static/js/[name].[contenthash].chunk.js",
      assetModuleFilename: "static/media/[hash][ext][query]",
    },
    resolve: {
      modules: [path.resolve("node_modules"), "node_modules"],
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [pathSrc],
          exclude: /node_modules/,
          loader: loader[0],
          options: loader[1],
        },
      ],
    },
    plugins: [
      isEnvProduction &&
        fs.readdirSync(pathPublic).length > 1 &&
        new CopyPlugin({
          patterns: [
            {
              from: pathPublic,
              to: pathBuild,
              filter: (resourcePath) => resourcePath !== pathHtml,
            },
          ],
        }),
      new HtmlWebpackPlugin({
        inject: true,
        template: pathHtml,
        ...(isEnvProduction && {
          minify: "auto",
        }),
      }),
      !isEnvProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };
};
