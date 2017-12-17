import { computed } from '@ember/object';
import { oneWay, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Component.extend(SlideshowComponentMixin, {
  classNames: ['post-nav-slideshow-post'],
  classNameBindings: ['isBlank:post-nav-slideshow-post-blank'],

  isOutgoing: oneWay('post.isOutgoing'),
  isIncoming: oneWay('post.isIncoming'),
  isBlank: oneWay('post.isBlank'),
  shouldRenderPost: or('visible', 'post.shouldPrerender'),

  intl: service(),
  messageBus: service(),
  modalManager: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    const nsfw = this.get('post.nsfw');

    this.get('messageBus').subscribe('enabledNsfw', this, () => this.notifyPropertyChange('nsfw'));
  },

  nsfw: computed({
    get() {
      console.log(this.get('post.model.nsfw'), localStorage.getItem('showNsfwContent') || sessionStorage.getItem('showNsfwContent'))
      return this.get('post.model.nsfw') && !(localStorage.getItem('showNsfwContent') || sessionStorage.getItem('showNsfwContent'));
    }
  }),

  actions: {
    toggleChat() {
      this.attrs.toggleChat();
    },
  
    viewNsfwForSession() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('nsfw.confirmation') });
      }).then(() => {
        sessionStorage.setItem('showNsfwContent', true);
        this.get('messageBus').publish('enabledNsfw');
      });
    },

    viewNsfwForAlways() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('nsfw.confirmation') });
      }).then(() => {
        localStorage.setItem('showNsfwContent', true);
        this.get('messageBus').publish('enabledNsfw');
      });
    }
  }
});
