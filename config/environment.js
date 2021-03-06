
module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    host: 'http://0.0.0.0:4000',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-paper': {
      'paper-toaster': {
        duration: 5000
      }
    },

    'polyfill-io': {
      features: [
        'Intl.~locale.en-US'
      ]
    },

    gReCaptcha: {
      jsUrl: 'https://recaptcha.net/recaptcha/api.js?render=explicit',
      siteKey: '6LfCT28UAAAAAN28PKrUUx1vrCCufEDBjHK-I-Hc'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.hostname = '0.0.0.0:4000';
    ENV.host = `http://${ENV.hostname}`;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.hostname = 'api.transtime.is';
    ENV.host = `https://${ENV.hostname}`;
  }

  return ENV;
};
