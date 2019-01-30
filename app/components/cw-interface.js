import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),
  cwManager: service(),
  modalManager: service(),

  contentIsViewable: computed('cwManager.approvedTagIds', 'cwManager.shouldHideWarnings', {
    get() {
      if (this.cwManager.shouldHideWarnings) return true;

      const approvedTagIds = this.get('cwManager.approvedTagIds');

      return this.get('content.tags').every((tag) => approvedTagIds.indexOf(tag.id) > -1);
    }
  }),

  _addTagsFor(storage) {
    const approvedTagIds = this.get('cwManager.approvedTagIds');
    const tags = this.get('content.tags');
    const maturityWarnings = ['nsfw', 'nudity', 'nude', 'mature'];

    if (tags.any((tag) => maturityWarnings.indexOf(tag.get('name').toLowerCase()) > -1  && approvedTagIds.indexOf(tag.get('id')) === -1)) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('contentWarnings.confirmation') });
      }).then(() => {
        this.get('cwManager').approveTags(storage, tags);
      });
    } else {
      this.get('cwManager').approveTags(storage, tags);
    }
  },

  actions: {
    addCWsForSession() {
      this._addTagsFor(sessionStorage);
    },

    addCWsForAlways() {
      this._addTagsFor(localStorage);
    }
  }
});
