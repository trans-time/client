import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },
  authenticate() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  },
  invalidate() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve();
    });
  }
});
