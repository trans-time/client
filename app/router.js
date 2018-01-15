import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('users', function() {
    this.route('user', { path: '/:username' }, function() {
      this.route('timeline');
      this.route('identities', function() {
        this.route('edit');
      });
      this.route('profile', function() {
        this.route('followers');
        this.route('following');
      });
    });
  });
  this.route('search', function() {});
  this.route('posts', function() {
    this.route('new');
    this.route('post', { path: '/:id' }, function() {
      this.route('edit');
      this.route('faves');
    });
  });

  this.route('account');
  this.route('comments', function() {
    this.route('comment', { path: '/:id' }, function() {
      this.route('faves');
    });
  });
  this.route('moderation', function() {
    this.route('flags', function() {
      this.route('flag', { path: '/:id'} );
    });
    this.route('reports', function() {
      this.route('report', { path: '/:id'} );
    });
  });
});

export default Router;
