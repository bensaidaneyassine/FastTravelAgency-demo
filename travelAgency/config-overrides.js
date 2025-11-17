const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Add minification for production build
    // if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        new TerserPlugin(),
        new CssMinimizerPlugin()
      ];
    // }

    return config;
  }
);
