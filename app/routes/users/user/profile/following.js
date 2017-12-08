import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const user = this.modelFor('users.user');

    return this.store.query('follow', { followerId: user.id, include: 'followed, followed.userProfile' });
  }
});