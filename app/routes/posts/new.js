import { computed, get, set } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, typeOf } from '@ember/utils';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { Promise, all } from 'rsvp';
import config from '../../config/environment';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  currentUser: service(),
  fileQueue: service(),
  intl: service(),

  user: oneWay('currentUser.user'),

  model() {
    const user = this.get('user');

    return this.store.createRecord('post', {
      user,
      date: Date.now()
    });
  },

  beforeModel(...args) {
    this._super(...args);

    this.set('title', this.get('intl').t('post.new'));
  },

  queue: computed({
    get() {
      const queues = get(this, 'fileQueue');
      return queues.find('uploadQueue') ||
             queues.create('uploadQueue');
    }
  }),

  uploadAndSave: task(function * (model) {
    const promises = [];
    model.get('panels').forEach((panel) => {
      promises.push(get(this, 'uploadImageTask').perform(panel));
    });
    yield all(promises);
    model.save();
  }),

  uploadImageTask: task(function * (panel) {
    const file = panel.get('file');

    if (isBlank(file)) return;

    try {
      const dataURL = yield file.readAsDataURL();
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      canvas.height = 1350;
      canvas.width = 1080;
      img.src = dataURL;

      yield new Promise((resolve) => {
        img.onload = () => {
          if (img.naturalHeight / img.naturalWidth < 1350 / 1080) {
            const width = (img.naturalHeight / 1350) * 1080;
            const percentX = panel.get('positioning.x') / 100;
            const startX = (percentX * img.naturalWidth) - (percentX * width);

            canvas.getContext('2d').drawImage(img, startX, 0, width, img.naturalHeight, 0, 0, 1080, 1350);
          } else {
            const height = (img.naturalWidth / 1080) * 1350;
            const percentY = panel.get('positioning.y') / 100;
            const startY = (percentY * img.naturalHeight) - (percentY * height);

            canvas.getContext('2d').drawImage(img, 0, startY, img.naturalWidth, height, 0, 0, 1080, 1350);
          }

          canvas.toBlob((blob) => {
            blob.name = get(file, 'name');
            const [newFile] = this.get('queue')._addFiles([blob], 'blob');
            newFile.upload(`${config.rootURL}images/upload`).then((result) => {
              set(panel, 'src', get(result, 'body.data.attributes.src'));
              panel.save().then(resolve);
            });
          }, 'image/jpeg');
        }
      })
    } catch (e) {
      console.log(e);
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    submit(model) {
      this.get('uploadAndSave').perform(model);
    }
  }
});
