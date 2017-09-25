import Ember from 'ember';

export default Ember.Mixin.create({
  meta: Ember.inject.service(),

  afterModel(...args) {
    this._super(...args);

    this.set('meta.title', this.get('title'));
  }
});
