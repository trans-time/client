import Ember from 'ember';
import PanelComponentMixin from 'client/mixins/panel-component';

export default Ember.Component.extend(PanelComponentMixin, {
  tagName: 'img',
  classNames: ['post-nav-slideshow-image'],
  attributeBindings: ['src'],

  loadPanel() {
    this.set('panel.loadPromise', new Ember.RSVP.Promise((resolve) => {
      this.element.onload = resolve;
    })).then(() => this.set('panel.isLoaded', true));
  },

  src: Ember.computed('panel.src', 'panel.shouldLoad', {
    get() {
      if (this.get('panel.shouldLoad')) return this.get('panel.src');
    }
  })
});
