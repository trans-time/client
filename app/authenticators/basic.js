import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },
  authenticate(options) {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },
  invalidate(data) {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  }
});
