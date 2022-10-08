const path = require("path")

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const fromPairs = require("lodash/fromPairs")
const isNil = require("lodash/isNil")
const omitBy = require("lodash/omitBy")
const sortBy = require("lodash/sortBy")
const toPairs = require("lodash/toPairs")
const CopyPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const webpack = require("webpack")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const pkg = require("./package.json")

// const { HMR_URL } = require('../constants')

const isDev = process.env.NODE_ENV === "development"
const isAnalyze = process.env.ANALYZE === "true"
// const hotMiddlewareScript = `webpack-hot-middleware/client?path=${HMR_URL}`

const ifDev = (dev, prod) => (isDev ? dev : prod)

module.exports = {
  cache: ifDev(
    {
      buildDependencies: {
        config: [__filename],
      },
      type: "filesystem",
    },
    false
  ),
  devtool: ifDev("cheap-module-source-map"),
  entry: omitBy(
    {
      background: ifDev(
        path.resolve("server", "entry", "background-auto-reload")
      ),
      "content-script": [path.resolve("src", "content-script")].reduce(
        (acc, cur) => {
          acc.push(cur)

          return acc
        },
        ifDev(
          [path.resolve("server", "entry", "content-script-auto-reload")],
          []
        )
      ),
      script: path.resolve("src", "script"),
    },
    isNil
  ),
  mode: ifDev("development", "production"),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  output: {
    clean: true,
    filename: "[name].js",
    path: path.resolve("build", ifDev("dev", "prod")),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src", "manifest.json"),
          transform: (content) => {
            let manifest = JSON.parse(content.toString())

            manifest = fromPairs(
              sortBy(
                toPairs(
                  omitBy(
                    {
                      ...manifest,
                      description: pkg.description,
                      name: pkg.name,
                      version: pkg.version,
                    },
                    (_value, key) => {
                      if (!isDev) {
                        if (key === "background") {
                          return true
                        }
                      }

                      return false
                    }
                  )
                )
              )
            )

            return JSON.stringify(manifest, null, 2)
          },
        },
        {
          from: path.resolve("src", "icons"),
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    ifDev([
      new CleanWebpackPlugin(),
      new ReactRefreshWebpackPlugin({ overlay: false }),
      new webpack.HotModuleReplacementPlugin(),
    ]),
    isAnalyze && new BundleAnalyzerPlugin(),
  ].reduce((acc, item) => {
    if (!item) return acc

    if (Array.isArray(item)) {
      acc.push(...item)
    } else {
      acc.push(item)
    }

    return acc
  }, []),
  resolve: {
    alias: {
      ClickToComponent: path.resolve(
        "node_modules",
        "click-to-react-component",
        "src",
        "ClickToComponent"
      ),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  stats: ifDev("errors-only", "minimal"),
}
