'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');

const TARGET = process.env.TARGET;
const ROOT_PATH = path.resolve(__dirname);
const APP_DIR = 'app';
const config = {
  paths: {
    dev: path.join(ROOT_PATH, APP_DIR),
    devIndex: path.join(ROOT_PATH, APP_DIR, '/index'),
  },
  entryPoints: [ "dataWorker" ] // add here the name of alternate entries
};

// list -> https://babeljs.io/docs/advanced/transformers/

let babelOptional = [
  // "es6.spec.blockScoping",
  // "es6.spec.symbols",
  // "es6.spec.templateLiterals",
  // "es7.asyncFunctions",
  "es7.classProperties",
  // "es7.comprehensions",
  // "es7.decorators",
  // "es7.doExpressions",
  // "es7.exponentiationOperator",
  // "es7.exportExtensions",
  // "es7.functionBind",
  "es7.objectRestSpread",
  // "es7.trailingFunctionCommas",
  // "asyncToGenerator",
  // "bluebirdCoroutines",
  // "runtime",
  // "utility.inlineEnvironmentVariables",
  // "spec.protoToAssign",
  // "spec.undefinedToVoid",
  // "validation.undeclaredVariableCheck",
  // "validation.react",
];

if (TARGET !== "dev") {
  babelOptional = babelOptional.concat([
    // "minification.deadCodeElimination",
    // "minification.constantFolding",
    // "minification.memberExpressionLiterals",
    // "minification.propertyLiterals",
    // "minification.removeConsole",
    // "minification.removeDebugger",
  ]);
}
// const babelBlacklist = [
//   "es6.arrowFunctions",
//   "es6.classes",
//   "es6.constants",
//         // "es6.destructuring",
//   "es6.forOf",
//         // "es6.modules",
//         // "es6.parameters",
//   "es6.properties.computed",
//   "es6.properties.shorthand",
//         // "es6.spread",
//         // "es6.tailCall",
//         // "es6.regex.unicode",
//         // "es6.regex.sticky",
// ];


const babel = "babel?"+
  babelOptional.map(opt => "optional[]="+ opt)
  // .concat(babelBlacklist.map(opt => "blacklist[]="+ opt))
  .join("&");

const IP = '0.0.0.0';
const PORT = 3333;

const setPath = (keys, pathTo) =>
  keys.reduce((r, key) => {
    r[key] = path.join(pathTo, key)
    return r;
  }, {});

const entry = setPath(config.entryPoints, config.paths.dev);

const merge = require('webpack-merge').bind(null, {
  resolve: {
    fallback: path.join(config.paths.dev, "lib"),
    extensions: ['', '.js', '.svg'],
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.svg$/, loader: __dirname +'/lib/icon_loader' },
    ]
  }
});

if (TARGET === 'dev') {
  entry.app = [
    'webpack-dev-server/client?http://webpack.cdenis.net',
    // 'webpack/hot/only-dev-server',
    config.paths.devIndex,
  ];

  module.exports = merge({
    ip: IP,
    port: PORT,
    devtool: 'eval',
    entry: entry,
    output: {
      path: __dirname,
      filename: '[name].js',
    },
    plugins: [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"development"'}}),
      // new webpack.HotModuleReplacementPlugin(),
      // new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        excludeChunks: config.entryPoints,
        title: pkg.name +' - '+ pkg.description +' (dev)'
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: [ babel ],
          include: [ config.paths.dev ],
        },
      ]
    }
  });
}

if (TARGET === 'public') {
  entry.app = config.paths.devIndex;
  // entry.vendors = [];
  module.exports = merge({
    entry,
    output: {
      path: './public',
      filename: '[name].js',
    },
    plugins: [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
      new webpack.optimize.DedupePlugin(),
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false
      //   },
      // }),
      // new webpack.optimize.CommonsChunkPlugin('vendors', 'bundle.js'),
      new HtmlWebpackPlugin({
        excludeChunks: config.entryPoints,
        title: pkg.name +' - '+ pkg.description
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: [ babel ],
          include: [ config.paths.dev ],
        }
      ]
    }
  });
}
