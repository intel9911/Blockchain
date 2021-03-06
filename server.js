require('babel-core/register');

['.css', '.less', '.sass', '.ttf', '.woff', '.woff2'].forEach((ext) => {
  require.extensions[ext] = () => {
  };
  return ext;
});
require('babel-polyfill');
require('./src/server/keystone.js');
