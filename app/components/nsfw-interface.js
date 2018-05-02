import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['timeline-item-nav-slideshow-nsfw'],

  intl: service(),
  messageBus: service(),
  modalManager: service(),

  changeset: computed({
    get() {
      return ['nsfwButt', 'nsfwGenitals', 'nsfwNipples', 'nsfwUnderwear'].reduce((changeset, type) => {
        changeset[type] = JSON.parse(sessionStorage.getItem(type)) || JSON.parse(localStorage.getItem(type))
        return changeset;
      }, {});
    }
  }),

  nsfwTypes: computed('nsfwContent.nsfwButt', 'nsfwContent.nsfwGenitals', 'nsfwContent.nsfwNipples', 'nsfwContent.nsfwUnderwear', {
    get() {
      return ['nsfwButt', 'nsfwGenitals', 'nsfwNipples', 'nsfwUnderwear'].reduce((warnings, type) => {
        if (this.get(`nsfwContent.${type}`)) warnings.push(this.get('intl').t(`post.attributes.${type}.label`));

        return warnings;
      }, []).join(', ')
    }
  }),

  actions: {
    viewNsfwForSession() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('nsfw.confirmation') });
      }).then(() => {
        sessionStorage.setItem('nsfw', true);
        const changeset = this.get('changeset');
        Object.keys(changeset).forEach((key) => sessionStorage.setItem(key, changeset[key]))
        this.get('messageBus').publish('enabledNsfw');
      });
    },

    viewNsfwForAlways() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('nsfw.confirmation') });
      }).then(() => {
        localStorage.setItem('nsfw', true);
        const changeset = this.get('changeset');
        Object.keys(changeset).forEach((key) => localStorage.setItem(key, changeset[key]))
        this.get('messageBus').publish('enabledNsfw');
      });
    }
  }
});
