const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.(css|scss)$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!sass!postcss'
        })
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate',
          'ts'
        ]
      },
      {
        test: /.html$/,
        loaders: [
          'html?' + JSON.stringify({
            attrs: ["img:src", "img:ng-src"]
          })
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif|jpeg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true, warnings: false}, // eslint-disable-line camelcase
      mangle: false // NOTE mangling was breaking the build
    }),
    new ExtractTextPlugin('index-[contenthash].css'),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  postcss: () => [autoprefixer],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    publicPath: "/spa/", // enable apache proxying on the head node
    filename: '[name]-[hash].js'
  },
  resolve: {
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts'
    ]
  },
  entry: {
    app: `./${conf.path.src('index')}`,
    vendor: Object.keys(pkg.dependencies)
  },
  ts: {
    configFileName: 'tsconfig.json'
  },
  tslint: {
    configuration: require('../tslint.json')
  }
};
