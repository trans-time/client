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

  panels: alias('post.panels'),

  _addImage: task(function * (file) {
    file.readAsDataURL().then((src) => {
      const post = this.get('post');
      const image = this.get('store').createRecord('image', {
        post,
        file,
        src,
        filename: get(file, 'name'),
        filesize: get(file, 'size'),
        positioning: {
          x: 50,
          y: 50
        }
      });

      post.get('panels').pushObject(image);
    });

    yield timeout(50);
  }).drop(),

  actions: {
    addImage(file) {
      this.get('_addImage').perform(file);
    },

    removeImage(image) {
      this.get('panels').removeObject(image);
      image.deleteRecord();
    }
  }
});
