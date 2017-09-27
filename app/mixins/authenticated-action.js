import Ember from 'ember';

export default Ember.Mixin.create({
  modalManager: Ember.inject.service(),
  session: Ember.inject.service(),

  authenticatedAction() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.get('session.isAuthenticated')) {
        resolve();
      } else {
        this.get('modalManager').open('auth-modal/login', resolve, reject);
      }
    });
  }
});
