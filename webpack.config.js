const fs = require('fs')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressPlugin    = require('webpack/lib/ProgressPlugin')
const autoprefixer      = require('autoprefixer')
const cssnano           = require('cssnano')
const postcssUrl        = require('postcss-url')

const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack')
const { AotPlugin }                                    = require('@ngtools/webpack')
const { CheckerPlugin, TsConfigPathsPlugin }           = require('awesome-typescript-loader')
const { CommonsChunkPlugin, UglifyJsPlugin }           = require('webpack').optimize

const {
  NoEmitOnErrorsPlugin,
  SourceMapDevToolPlugin,
  NamedModulesPlugin,
  HashedModuleIdsPlugin,
} = require('webpack')

const nodeModules = path.join(process.cwd(), 'node_modules')
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules')
const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main']
const baseHref = ''
const deployUrl = ''

module.exports = function (env) {
  const minimizeCss = env === 'prod'

  function postcssPlugins() {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i
    const minimizeOptions = {
      autoprefixer: false,
      safe: true,
      mergeLonghand: false,
      discardComments: { remove: comment => !importantCommentRe.test(comment) },
    }
    return [
      postcssUrl({
        url: URL => {
          if (URL.url) {
            URL = URL.url
          }
          // Only convert root relative URLs, which CSS-Loader won't process into require().
          if (!URL.startsWith('/') || URL.startsWith('//')) {
            return URL

          } if (deployUrl.match(/:\/\//)) {
            // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
            return `${deployUrl.replace(/\/$/, '')}${URL}`

          } else if (baseHref.match(/:\/\//)) {
            // If baseHref contains a scheme, include it as is.
            return baseHref.replace(/\/$/, '') +
              `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/')

          } else {
            // Join together base-href, deploy-url and the original URL.
            // Also dedupe multiple slashes into single ones.
            return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/')
          }
        }
      }),
      autoprefixer(),
    ].concat(minimizeCss ? [cssnano(minimizeOptions)] : [])
  }

  let config = {
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['./node_modules'],
    },
    resolveLoader: {
      modules: ['./node_modules'],
    },
    entry: {
      main: ['./src/main.ts'],
      polyfills: ['./src/polyfills.ts'],
      styles: ['./src/styles.scss'],
    },
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [/\/node_modules\//],
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(eot|svg)$/,
          loader: 'file-loader?name=[name].[hash:20].[ext]',
        },
        {
          test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
          loader: "url-loader?name=[name].[hash:20].[ext]&limit=10000",
        },
        {
          exclude: [path.join(process.cwd(), 'src/styles.scss')],
          test: /\.css$/,
          use: [
            'exports-loader?module.exports.toString()',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
          ],
        },
        {
          exclude: [path.join(process.cwd(), 'src/styles.scss')],
          test: /\.scss$|\.sass$/,
          use: [
            'exports-loader?module.exports.toString()',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                precision: 8,
                includePaths: [],
              },
            },
          ],
        },
        {
          include: [path.join(process.cwd(), 'src/styles.scss')],
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              }
            },
          ],
        },
        {
          include: [path.join(process.cwd(), 'src/styles.scss')],
          test: /\.scss$|\.sass$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                precision: 8,
                includePaths: [],
              },
            },
          ],
        },
        {
          test: /sim\/.*\.ts$/,
          loader: 'awesome-typescript-loader?configFileName=./sim/tsconfig.json',
        },
        {
          test: /src\/.*\.ts$/,
          loader: '@ngtools/webpack',
        },
      ]
    },
    plugins: [
      new NoEmitOnErrorsPlugin(),
      new GlobCopyWebpackPlugin({
        patterns: ['assets', 'favicon.ico'],
        globOptions: {
          cwd: path.resolve('src'),
          dot: true,
          ignore: '**/.gitkeep'
        },
      }),
      new ProgressPlugin(),
      new SourceMapDevToolPlugin({
        filename: '[file].map[query]',
        moduleFilenameTemplate: '[resource-path]',
        fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        sourceRoot: 'webpack:///',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: function sort(left, right) {
          let leftIndex = entryPoints.indexOf(left.names[0])
          let rightindex = entryPoints.indexOf(right.names[0])
          if (leftIndex > rightindex) { return 1 }
          else if (leftIndex < rightindex) { return -1 }
          else { return 0 }
        },
        minify: env === 'prod' ? {
          caseSensitive: true,
          collapseWhitespace: true,
          keepClosingSlash: true,
        } : false,
      }),
      new BaseHrefWebpackPlugin({}),
      new CommonsChunkPlugin({
        minChunks: 2,
        async: 'common',
      }),
      new CommonsChunkPlugin({
        name: 'inline',
        minChunks: null,
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => module.resource &&
                   (module.resource.startsWith(nodeModules)
                     || module.resource.startsWith(genDirNodeModules)
                    || module.resource.startsWith(realNodeModules)),
        chunks: ['main'],
      }),
      new CheckerPlugin(),
      new TsConfigPathsPlugin(),
      new AotPlugin({
        mainPath: 'main.ts',
        hostReplacementPaths: {
          'environments/environment.ts': env === 'prod' ?
            'environments/environment.prod.ts' : 'environments/environment.ts'
        },
        exclude: [],
        tsConfigPath: 'src/tsconfig.app.json',
        skipCodeGeneration: env === 'prod' ? false : true,
        compilerOptions: {
          // We get an error right now about unused paramters in prod builds.
          // Disable it here.
          noUnusedParameters: env !== 'prod',
        },
      }),
    ],
    node: {
      fs: 'empty',
      global: true,
      crypto: 'empty',
      tls: 'empty',
      net: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
    },
    devServer: {
      historyApiFallback: true,
    },
  }

  if (env === 'prod') {
    config.plugins.push(
      new HashedModuleIdsPlugin(),
      new UglifyJsPlugin({
        mangle: { screw_ie8: true },
        compress: { screw_ie8: true, warnings: true },
        sourceMap: true,
      })
    )
  }

  return config
}
