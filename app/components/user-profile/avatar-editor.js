import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  height: 1080,
  width: 1080,
  classNames: ['user-profile-avatar-editor'],

  modalManager: service(),

  changeset: alias('options.changeset'),

  panels: computed(() => A()),

  didReceiveAttrs(...args) {
    this._super(...args);

    this._replacePanel(this.get('options.changeset.avatar'));
  },

  _replacePanel(src) {
    const panels = this.get('panels');

    panels.clear();

    panels.pushObject({
      src,
      positioning: {
        x: 50,
        y: 50
      }
    });
  },

  _addImage: task(function * (dataUri) {
    this._replacePanel(dataUri);

    yield timeout(50);
  }).drop(),

  _cropImage: task(function * (panel) {
    if (isNone(panel)) return resolve(null);

    const { height, width } = this.getProperties('height', 'width');
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    img.src = panel.src;

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

        canvas.toBlob((blob) => {
          resolve(blob);
        }, panel.src.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0], 1.0);
      }
    });
  }),

  _blobToDataURL(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(blob);
    });
  },

  actions: {
    addImage(dataUri) {
      this.set('_changed', true);
      this.get('_addImage').perform(dataUri);
    },

    removeImage() {
      this.set('_changed', true);
      this.get('panels').clear();
    },

    cancel() {
      this.get('modalManager').close('reject');
    },

    save() {
      if (this.get('_changed')) {
        this.get('_cropImage').perform(this.get('panels.firstObject')).then((avatar) => {
          if (isPresent(avatar)) {
            this.set('changeset.avatarUpload', avatar);
            this._blobToDataURL(avatar).then((dataUri) => {
              this.set('changeset.avatar', dataUri);
              this.get('modalManager').close('resolve');
            });
          } else {
            this.set('changeset.avatarUpload', undefined);
            this.set('changeset.avatar', undefined);
            this.get('modalManager').close('resolve');
          }
        });
      } else {
        this.get('modalManager').close('resolve');
      }
    }
  }
});
