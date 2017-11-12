import { get, set } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, typeOf } from '@ember/utils';
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

  uploadFileTask: task(function * (file, type) {
    const post = this.modelFor('posts.new');
    const fileModel = this.store.createRecord(type, {
      post,
      filename: get(file, 'name'),
      filesize: get(file, 'size')
    });

    try {
      file.readAsDataURL().then((src) => {
        if (isBlank(get(fileModel, 'src'))) {
          set(fileModel, 'src', src);
        }
      });

      yield file.upload(`${config.rootURL}${type}s/upload`);
      post.get('panels').pushObject(fileModel);
    } catch (e) {
      fileModel.deleteRecord();
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadFile(file, type) {
      get(this, 'uploadFileTask').perform(file, type);
    },

    submit(model) {
      model.save();
    }
  }
});
