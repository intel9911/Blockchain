// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
const config = require('./config/vars');

// Require keystone
const keystone = require('keystone');

const port = process.env.PORT || 3000;

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
  name: 'shopshot',
  brand: 'shopshot',
  mongo: config.MONGO_URI,

  sass: 'public',
  static: ['../../build', 'public'],
  favicon: 'public/favicon.ico',
  views: 'templates/views',
  'view engine': 'jade',
  's3 config': {
    bucket: 'shopshots',
    key: 'AKIAJ5CQKS2HHNRM24HQ',
    secret: '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',
  },

  'auto update': true,
  session: true,
  auth: true,
  'user model': 'User',
  'cookie secret': config.COOKIE_SECRET,
  port,
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  users: 'User',
  storeItem: 'StoreItem',
  category: 'Category',
  sale: 'Sale',
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
