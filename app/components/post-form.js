import Component from '@ember/component';
import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { filter, or, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import calculateInitialPosition from 'client/utils/calculate-initial-position';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';
import { task, timeout } from 'ember-concurrency';

const PostValidations = {
  text: [
    validateLength({ max: 63206 })
  ]
};

export default Component.extend({
  height: 1800,
  width: 1440,
  mode: 'text',

  classNames: ['post-form'],

  store: service(),

  orderedImages: sort('post.images', (a, b) => a.get('order') - b.get('order')),

  disabled: computed('changeset.isInvalid', 'changeset.isPristine', '_panelsAddedOrRemoved', '_panelOrderChanged', {
    get() {
      if (this.get('changeset.isInvalid')) return true;
      else return !this.get('_panelsAddedOrRemoved') && !this.get('_panelOrderChanged') && this.get('changeset.isPristine');
    }
  }),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('post'), lookupValidator(PostValidations), PostValidations));
    this.set('changeset.contentWarnings', this.get('post.timelineItem.contentWarnings').map((cw) => cw.get('name')).join(', '));
    this.get('changeset').validate();
    this.set('_initialPanels', this.get('post.panels').toArray());
  },

  _panelsAddedOrRemoved: computed('post.images.@each.src', function() {
    const initial = this.get('_initialPanels');
    const current = this.get('post.panels').toArray().filter((panel) => isPresent(panel.get('src')));

    return initial.length !== current.length || !initial.every((panel) => current.includes(panel));
  }),

  _panelOrderChanged: computed('post.panels.@each.hasDirtyAttributes', {
    get() {
      return this.get('post.panels').any((panel) => panel.get('hasDirtyAttributes'))
    }
  }),

  _addImage: task(function * (src) {
    const post = this.get('post');

    const imageElement = new Image();

    imageElement.onload = () => {
      const positioning = calculateInitialPosition(this.height, this.width, imageElement);

      const image = this.get('store').createRecord('image', {
        positioning,
        post,
        src,
        order: (this.get('orderedImages.lastObject.order') || 0) + 1
      });

      post.get('images').pushObject(image);
    }
    imageElement.src = src;

    yield timeout(50);
  }).drop(),

  actions: {
    addImage(dataUri) {
      this.get('_addImage').perform(dataUri);
    },

    removeImage(image) {
      image.set('src', undefined);
    },

    switchToText() {
      this.set('mode', 'text');
    },

    switchToCamera() {
      this.set('mode', 'camera');
    }
  }
});
