import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  height: 1350,
  width: 1080,

  classNames: ['post-form-image-editor'],

  store: service(),

  images: alias('post.images'),

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
      this.get('images').removeObject(image);
      image.deleteRecord();
    }
  }
});
