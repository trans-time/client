'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var env = EmberApp.env()|| 'development';
  var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;

  var fingerprintOptions = {
    enabled: true,
    extensions: ['js', 'css', 'png', 'jpg', 'gif']
  };

  switch (env) {
    case 'development':
      fingerprintOptions.prepend = 'http://localhost:4200/';
    break;
    case 'staging':
      fingerprintOptions.prepend = 'TODO';
    break;
    case 'production':
      fingerprintOptions.prepend = 'https://www.transtime.is/';
    break;
  }

  var app = new EmberApp(defaults, {
    fingerprint: fingerprintOptions,
    emberCLIDeploy: {
      runOnPostBuild: false,
      shouldActivate: true
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild,
    },
    minifyCSS: { enabled: isProductionLikeBuild },
    minifyJS: { enabled: isProductionLikeBuild },

    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild
  });

  app.import('bower_components/lethargy/lethargy.js');
  app.import('bower_components/linkifyjs/linkify.js');
  app.import('bower_components/linkifyjs/linkify-html.js');
  app.import('node_modules/croppie/croppie.css');
  app.import('node_modules/croppie/croppie.js', {
    using: [
      { transformation: 'amd', as: 'croppie' }
    ]
  });

  return app.toTree();
};
