import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, oneWay } from '@ember/object/computed'
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { task, timeout } from 'ember-concurrency';
import croppie from 'croppie';

export default Component.extend({
  classNames: ['image-editor-display-image-container'],

  positioning: alias('displayImage.positioning'),
  src: oneWay('displayImage.src'),

  didInsertElement() {
    this.set('croppie', new Croppie(this.imgElement, this.croppieOptions));

    this.element.querySelector('.croppie-container').addEventListener('update', (ev) => {
      const points = ev.detail.points;

      const positioning = [
        points[0] / this.imgElement.naturalWidth,
        points[1] / this.imgElement.naturalHeight,
        points[2] / this.imgElement.naturalWidth,
        points[3] / this.imgElement.naturalHeight
      ];

      this.set('positioning', positioning);
    });

    return this._super(...arguments);
  },

  didReceiveAttrs() {
    if (this.croppie) {
      next(() => {
        const points = this.positioning[0] !== undefined ? [
          this.positioning[0] * this.imgElement.naturalWidth,
          this.positioning[1] * this.imgElement.naturalHeight,
          this.positioning[2] * this.imgElement.naturalWidth,
          this.positioning[3] * this.imgElement.naturalHeight
        ] : undefined;

        this.croppie.bind({
          points,
          url: this.src,
          zoom: 1
        });
      });
    }

    return this._super(...arguments);
  },

  willDestroyElement() {
    this.croppie.destroy();

    return this._super(...arguments);
  },

  croppieOptions: computed({
    get() {
      const buffer = 1;
      const idealRatio = this.height / this.width;
      const boundary = {
        height: this.element.clientWidth * idealRatio,
        width: this.element.clientWidth
      }

      return {
        boundary,
        viewport: {
          height: boundary.height / buffer,
          width: boundary.width / buffer
        }
      };
    }
  }),

  imgElement: computed('src', {
    get() {
      return this.element.querySelector('img');
    }
  })
});
