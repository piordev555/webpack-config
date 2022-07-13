# webpack-config-react

A bare, modern Webpack 5 config to create a react app without [create-react-app](https://github.com/facebook/create-react-app). Not battery included!

**Note:** This package is only for those who are experienced with web bundling, transpilation (eg. `@babel/preset-env`), optimization, since it comes with **no opinionated configuration** out of the box. If you are a beginner, it's better to stick with [create-react-app](https://github.com/facebook/create-react-app) or use [Next.js](https://nextjs.org/).

## Features

- Freedom to config CSS, images, svg, etc. (eg. Use the new [Asset Modules](https://webpack.js.org/guides/asset-modules/))
- Support both [babel](https://babeljs.io/) and [swc](https://swc.rs/). Allow custom config files.
- Public folder (`./public`)
- [Examples](./examples) to incrementally add back features like [CSS, PostCSS, SASS, Modules](./examples/css-postcss-sass) or [TypeScript](./examples/typescript).

## Installation

```bash
npm i --save-dev webpack-config-react webpack webpack-cli webpack-dev-server
```

## Usage

### package.json scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack serve"
  }
}
```

To serve the built app, you can use [sirv-cli](https://www.npmjs.com/package/sirv-cli):

```json
{
  "scripts": {
    "start": "sirv build"
  }
}
```

[Create React App Deployment article](https://create-react-app.dev/docs/deployment) also helps since this config also outputs file to `build` (by defaults).

### webpack.config.js

Create `webpack.config.js`:

```js
const { createConfig } = require("webpack-config-react");

module.exports = async (env, argv) => {
  const webpackConfig = await createConfig(
    argv.mode === "production" || env.production
  );
  return webpackConfig;
};
```

To extend `webpack-config-react`, we can use [webpack-merge](https://github.com/survivejs/webpack-merge) to merge additional configs into the return value of `await createConfig()`.

```bash
npm i --save-dev webpack-merge
```

See [examples](examples) for some usages.

Up next, depending on your preferences and requirements, we can either use [babel](https://babeljs.io/) or [swc](https://swc.rs/).

### With babel

[Example](./examples/simple)

Install dependencies:

```bash
npm i --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
```

Create `babel.config.json` (or [other formats](https://babeljs.io/docs/en/config-files#configuration-file-types))

```json
{
  "presets": [
    ["@babel/preset-env"],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

### With swc

[Example](./examples/swc)

Install dependencies:

```bash
npm i --save-dev @swc/core swc-loader
```

Create `.swcrc`:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  }
}
```

## Recommended Configs

Aiming to be simple, this does not include configs that are helpful to development. The following shows how to re-enable them.

<details>
<summary>Source map</summary>

[source-map-loader](https://webpack.js.org/loaders/source-map-loader/)

```js
module.exports = async (env, argv) => {
  const isEnvProduction = argv.mode === "production" || env.production;
  const webpackConfig = await createConfig(isEnvProduction);
  return merge(webpackConfig, {
    devtool: isEnvProduction ? "source-map" : "eval-source-map",
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },
  });
};
```

</details>

## Configurations

An options param can passed as the second argument to `createConfig`.

```js
createConfig(isEnvProduction, options);
```

- `moduleFileExtensions`: A list of module file extension to resolve. Default: `["web.mjs","mjs","web.js","js","web.ts","ts","web.tsx","tsx","json","web.jsx","jsx"]`.
- `pathEntry`: Path to entry file. Default: `./src/index.js`.
- `pathSrc`: Path to src directory (will be proccessed by babel-loader/swc-loader). Default: `./src`.
- `pathHtml`: Path to HTML file. Default: `./public/index.html`.
- `pathBuild`: Path to build output directory. Default: `./build`.
- `pathPublic`: Path to "public" folder (will be copied to build directory). Default: `./public`.
