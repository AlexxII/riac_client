const { pluginName } = require("mini-css-extract-plugin");

const plugins = [];
if (process.env.NODE_ENV === 'development') {
  plugins.push('react-refresh/babel');
}

module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins,
};