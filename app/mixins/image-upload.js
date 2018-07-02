import Mixin from '@ember/object/mixin';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import { Promise, all, resolve } from 'rsvp';
import config from '../config/environment';

export default Mixin.create({
  currentUser: service(),
  fileQueue: service(),
  modalManager: service(),
  paperToaster: service(),
  session: service(),

  queue: computed({
    get() {
      const queues = get(this, 'fileQueue');
      return queues.find('uploadQueue') ||
             queues.create('uploadQueue');
    }
  }),

  uploadAndSave: task(function * (model) {
    this.get('modalManager').open('uploading-modal');

    const post = yield model.save();
    const promises = model.get('_content.panels').map((panel, index) => {
      panel.set('order', index);
      return get(this, 'uploadImageTask').perform(panel);
    });

    all(promises).then(() => {
      this.transitionTo('posts.post', post.id);
    }).catch(() => {
      this.get('paperToaster').show(this.get('intl').t('upload.unsuccessful'), {
        duration: 4000,
        toastClass: 'paper-toaster-error-container'
      });
    }).finally(() => this.get('modalManager').close());
  }),

  uploadImageTask: task(function * (panel) {
    const src = panel.get('src');
    const isNew = panel.get('isNew');

    // avoid uploading blob src
    if (isPresent(src) && src.indexOf('http') !== 0) panel.set('src', undefined);

    if ((isBlank(src) && isNew) || panel.get('isMarkedForDeletion')) return resolve();
    else if (isBlank(src) && !isNew) return panel.destroyRecord();

    yield panel.save().finally(() => {
      // ensure panel has src
      panel.set('src', src);
    });

    if (!isNew && isPresent(src) && src.indexOf('http') === 0) return resolve();

    const canvasHeight = 1800;
    const canvasWidth = 1440;
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    img.src = src;

    yield new Promise((resolve, reject) => {
      img.onload = () => {
        if (img.naturalHeight / img.naturalWidth < canvasHeight / canvasWidth) {
          const width = (img.naturalHeight / canvasHeight) * canvasWidth;
          const percentX = panel.get('positioning.x') / 100;
          const startX = (img.naturalWidth - width) * percentX;

          canvas.getContext('2d').drawImage(img, startX, 0, width, img.naturalHeight, 0, 0, canvasWidth, canvasHeight);
        } else {
          const height = (img.naturalWidth / canvasWidth) * canvasHeight;
          const percentY = panel.get('positioning.y') / 100;
          const startY = (img.naturalHeight - height) * percentY;

          canvas.getContext('2d').drawImage(img, 0, startY, img.naturalWidth, height, 0, 0, canvasWidth, canvasHeight);
        }

        canvas.toBlob((blob) => {
          blob.name = `post-${panel.get('post.id')}-panel-${panel.get('order')}.${blob.type.split('/')[1]}`;
          const [newFile] = this.get('queue')._addFiles([blob], 'blob');
          const path = `${config.host}${config.rootURL}${getOwner(this).lookup('adapter:application').get('namespace')}/images/${panel.get('id')}/files`;
          this.get('session').authorize('authorizer:basic', (key, authorization) => {
            newFile.upload(path, { headers: { Authorization: authorization }}).then((response) => {
              panel.reload();
              resolve();
            }).catch(() => reject());
          })
        }, src.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0], 1.0);
      }
    })
  }).maxConcurrency(3).enqueue(),

  actions: {
    cancel(model) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('post.cancel') });
      }).then(() => {
        history.back();
      });
    },

    willTransition() {
      const model = this.get('controller.model');
      const panels = model.get('panels');

      model.rollbackAttributes();

      for (let i = panels.get('length') - 1; i > -1; --i) {
        const panel = panels.objectAt(i);
        panel.rollbackAttributes();
        if (panel.get('isNew')) {
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
