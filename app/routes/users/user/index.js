import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {
      this.transitionTo('users.user.profile.index');
    }
  }
});
