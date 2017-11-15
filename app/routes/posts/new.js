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

  uploadFileTask: task(function * (panel) {
    const file = panel.get('file');

    if (isBlank(file)) return;

    try {
      file.readAsDataURL().then((src) => {
        if (isBlank(get(panel, 'src'))) {
          set(panel, 'src', src);
        }
      });

      const result = yield file.upload(`${config.rootURL}images/upload`);
      set(panel, 'src', get(result, 'body.data.attributes.src'));
      yield panel.save();
    } catch (e) {
      console.log(e);
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadFile(file, type) {
      get(this, 'uploadFileTask').perform(file, type);
    },

    submit(model) {
      model.get('panels').forEach((panel) => {
        get(this, 'uploadFileTask').perform(panel);
      });
      model.save();
    }
  }
});
