import Ember from 'ember';
import SlideshowComponent from './slideshow-component';

export default Ember.Mixin.create(SlideshowComponent, {
  classNames: ['post-nav-slideshow-panel'],

  isAnimating: Ember.computed.equal('axis', 'x'),

  isOutgoing: Ember.computed.oneWay('panel.isOutgoing'),
  isIncoming: Ember.computed.oneWay('panel.isIncoming'),

  didInsertElement(...args) {
    this._super(...args);

    this.loadPanel();
  },

  loadPanel() {
    this.set('panel.isLoaded', true);
  }
});
