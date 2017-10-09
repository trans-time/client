import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  configuration: Ember.computed.alias('user.userConfiguration'),

  load() {
    const userId = this.get('session.data.authenticated.id');

    if (!Ember.isEmpty(userId)) {
      const store = this.get('store');

      return store.findRecord('user', userId).then((user) => {
        this.set('user', user);

        store.findRecord('user-configuration', userId).then((userConfiguration) => {
          user.set('userConfiguration', userConfiguration);
        });
      });
    } else {
      return Ember.RSVP.resolve();
    }
  }
});
