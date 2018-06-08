import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { filter } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  height: 1800,
  width: 1440,

  classNames: ['post-form-image-editor'],

  store: service(),

  images: filter('post.images', (image) => !image.get('isMarkedForDeletion')),

  _addImage: task(function * (src) {
    const post = this.get('post');
    const image = this.get('store').createRecord('image', {
      post,
      src,
      positioning: {
        x: 50,
        y: 50
      }
    });

    post.get('images').pushObject(image);

    yield timeout(50);
  }).drop(),

  actions: {
    addImage(dataUri) {
      this.get('_addImage').perform(dataUri);
    },

    removeImage(image) {
      image.set('src', undefined);
    }
  }
});
