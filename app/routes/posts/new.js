import { get, set } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import config from '../../config/environment';

export default Route.extend({
  currentUser: service(),
  user: oneWay('currentUser.user'),

  model() {
    const user = this.get('user');

    return this.store.createRecord('post', {
      user,
      date: Date.now()
    });
  },

  uploadPhoto: task(function * (file) {
    const post = this.modelFor('posts.new');
    const image = this.store.createRecord('image', {
      post,
      filename: get(file, 'name'),
      filesize: get(file, 'size')
    });

    try {
      file.readAsDataURL().then(function (src) {
        if (get(image, 'src') == null) {
          set(image, 'src', src);
        }
      });

      let response = yield file.upload(`${config.rootURL}images/upload`);
      set(image, 'src', response.headers.Location);
      post.get('panels').pushObject(image);
      yield image.save();
    } catch (e) {
      image.rollback();
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadImage(file) {
      get(this, 'uploadPhoto').perform(file);
    },

    submit(model) {
      model.save();
    }
  }
});
