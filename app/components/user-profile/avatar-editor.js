import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  height: 145,
  width: 145,
  classNames: ['user-profile-avatar-editor'],

  modalManager: service(),

  changeset: alias('options.changeset'),

  panels: computed(() => A()),

  didReceiveAttrs(...args) {
    this._super(...args);

    this._replacePanel(this.get('options.changeset.avatar'));
  },

  _replacePanel(src, file = {}) {
    const panels = this.get('panels');

    panels.clear();

    panels.pushObject({
      file,
      src,
      filename: get(file, 'name'),
      filesize: get(file, 'size'),
      positioning: {
        x: 50,
        y: 50
      }
    });
  },

  _addImage: task(function * (file) {
    file.readAsDataURL().then((src) => {
      this._replacePanel(src, file);
    });

    yield timeout(50);
  }).drop(),

  _cropImage: task(function * (panel) {
    if (isNone(panel) || isNone(get(panel, 'file'))) return resolve(null);

    const file = get(panel, 'file');
    const { height, width } = this.getProperties('height', 'width');
    const dataURL = yield file.readAsDataURL();
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    img.src = dataURL;

    return new Promise((resolve) => {
      img.onload = () => {
        if (img.naturalHeight / img.naturalWidth < height / width) {
          const sectionWidth = (img.naturalHeight / height) * width;
          const percentX = get(panel, 'positioning.x') / 100;
          const startX = (percentX * img.naturalWidth) - (percentX * width);

          canvas.getContext('2d').drawImage(img, startX, 0, sectionWidth, img.naturalHeight, 0, 0, width, height);
        } else {
          const sectionHeight = (img.naturalWidth / width) * height;
          const percentY = get(panel, 'positioning.y') / 100;
          const startY = (percentY * img.naturalHeight) - (percentY * height);

          canvas.getContext('2d').drawImage(img, 0, startY, img.naturalWidth, sectionHeight, 0, 0, width, height);
        }

        resolve(canvas.toDataURL('image/jpeg', 1.0));
        // canvas.toBlob((blob) => {
        //   blob.name = get(file, 'name');
        //   resolve(blob);
        // }, 'image/jpeg');
      }
    });
  }),

  actions: {
    addImage(file) {
      this.get('_addImage').perform(file);
    },

    removeImage() {
      this.get('panels').clear();
    },

    cancel() {
      this.get('modalManager').close('reject');
    },

    save() {
      this.get('_cropImage').perform(this.get('panels.firstObject')).then((avatar) => {
        this.set('changeset.avatar', avatar);
        this.get('modalManager').close('resolve');
      });
    }
  }
});
