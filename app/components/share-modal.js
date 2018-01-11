import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['main-modal-content', 'share-modal'],

  modalManager: service(),

  fullShare: oneWay('options.fullShare'),
  postId: oneWay('options.postId'),

  didInsertElement(...args) {
    this._super(...args);

    this.get('fullShare') ? this.set('selected', 0) : this.set('selected', 3);
  },

  copyUrl: computed('selected', {
    get() {
      const href = location.href;
      const selected = this.get('selected');
      const postIdStartIndex = href.indexOf('postId=');
      let postIdEndIndex = href.slice(postIdStartIndex).indexOf('&');
      postIdEndIndex = postIdEndIndex === -1 ? href.length : postIdEndIndex - 1;

      switch (selected) {
        case 0: return `${href.slice(0, postIdStartIndex)}${href.slice(postIdEndIndex)}`;
        case 1: return href;
        case 2: return `${href.slice(0, postIdStartIndex)}${href.slice(postIdEndIndex)}&lastPost=true`;
        case 3: {
          const url = new URL(href);

          return `${url.origin}/posts/${this.get('postId')}`;
        }
      }
    }
  }),

  actions: {
    selectBeginning() {
      this.set('selected', 0);
    },

    selectHere() {
      this.set('selected', 1);
    },

    selectEnd() {
      this.set('selected', 2);
    },

    selectPost() {
      this.set('selected', 3);
    },

    copied() {
      this.get('modalManager').close();
    }
  }
});
