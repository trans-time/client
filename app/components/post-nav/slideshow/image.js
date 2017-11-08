import { computed } from '@ember/object';
import { Promise as EmberPromise } from 'rsvp';
import Component from '@ember/component';
import SlideshowPanelComponentMixin from 'client/mixins/slideshow-panel-component';

export default Component.extend(SlideshowPanelComponentMixin, {
  tagName: 'img',
  classNames: ['post-nav-slideshow-image'],
  attributeBindings: ['src'],

  loadPanel() {
    this.set('panel.loadPromise', new EmberPromise((resolve) => {
      this.element.onload = resolve;
    })).then(() => this.set('panel.isLoaded', true));
  },

  src: computed('panel.src', 'panel.shouldLoad', {
    get() {
      if (this.get('panel.shouldLoad')) return this.get('panel.src');
    }
  })
});
