import Component from '@ember/component';
import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { Promise, resolve } from 'rsvp';
import calculateInitialPosition from 'client/utils/calculate-initial-position';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  height: 1440,
  width: 1440,
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
    const imageElement = new Image();

    imageElement.onload = () => {
      const positioning = calculateInitialPosition(this.height, this.width, imageElement);

      panels.clear();
      panels.pushObject({
        src,
        positioning
      });
    }
    imageElement.src = src;
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
        canvas.getContext('2d').drawImage(
          img,
          img.naturalWidth * panel.positioning[0],
          img.naturalHeight * panel.positioning[1],
          (img.naturalWidth * panel.positioning[2]) - (img.naturalWidth * panel.positioning[0]),
          (img.naturalHeight * panel.positioning[3]) - (img.naturalHeight * panel.positioning[1]),
          0,
          0,
          width,
          height
        );

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
