import Mixin from '@ember/object/mixin';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import { Promise, all } from 'rsvp';
import config from '../config/environment';

export default Mixin.create({
  fileQueue: service(),
  modalManager: service(),

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
    model.save().then((post) => {
      this.transitionTo('users.user.timeline', post.get('user.content'), { queryParams: { postId: post.id } });
    });
  }),

  uploadImageTask: task(function * (panel) {
    const file = panel.get('file');

    if (isBlank(file) || !panel.get('hasDirtyAttributes')) return;

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
      console.log(e); // eslint-disable-line
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    cancel(model) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('post.cancel') });
      }).then(() => {
        if (isPresent(model.get('id'))) {
          this.transitionTo('users.user.timeline', model.get('user'), { queryParams: { postId: model.get('id') } });
        } else {
          this.transitionTo('index');
        }
      });
    },

    willTransition() {
      const model = this.get('controller.model');
      const panels = model.get('panels');

      model.rollbackAttributes();

      for (let i = panels.get('length') - 1; i > -1; --i) {
        const panel = panels.objectAt(i);
        if (isPresent(panel) && panel.get('isNew')) {
          panels.removeObject(panel);
          panel.deleteRecord();
        }
      }

      return true;
    },

    submit(model) {
      this.get('uploadAndSave').perform(model);
    }
  }
});
