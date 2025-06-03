const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => ({
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.[contenthash].js',
  },
  devtool: env.prod ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: "defaults",
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, 'src/css/to_min'),
        ],
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env.prod ? false : true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, 'src/css/to_prefix_min'),
        ],
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env.prod ? false : true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: env.prod ? false : true,
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      browsers: 'last 2 versions',
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env.prod ? false : true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: env.prod ? false : true,
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      browsers: 'last 2 versions',
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: env.prod ? false : true,
              sassOptions: {
                silenceDeprecations: ['import'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['dist'],
        },
      },
    }),
  ],
  devServer: {
    hot: true,
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { name: 'preset-default' }],
            ],
          },
        },
      }),
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
});
