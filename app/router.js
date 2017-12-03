import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('users', function() {
    this.route('user', { path: '/:id' }, function() {
      this.route('timeline');
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
    });
  });

  this.route('user', function() {
    this.route('user', function() {});
  });
});

export default Router;
