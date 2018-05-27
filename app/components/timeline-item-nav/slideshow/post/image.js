import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { Promise as EmberPromise } from 'rsvp';
import Component from '@ember/component';
import SlideshowPanelComponentMixin from 'client/mixins/slideshow-panel-component';

export default Component.extend(SlideshowPanelComponentMixin, {
  tagName: 'img',
  classNames: ['timeline-item-nav-slideshow-image'],
  classNameBindings: ['deleted'],
  attributeBindings: ['srcset', 'sizes'],

  deleted: oneWay('panel.model.deleted'),

  loadPanel() {
    this.set('panel.loadPromise', new EmberPromise((resolve) => {
      this.element.onload = resolve;
    })).then(() => this.set('panel.isLoaded', true));
  },

  srcset: computed('panel.srcset', 'panel.shouldLoad', {
    get() {
      if (this.get('panel.shouldLoad')) return this.get('panel.srcset');
    }
  }),

  sizes: '100vw'
});
