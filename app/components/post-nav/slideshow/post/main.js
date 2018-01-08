import { computed } from '@ember/object';
import { oneWay, or } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';
import { EKMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, SlideshowComponentMixin, {
  classNames: ['post-nav-slideshow-post'],
  classNameBindings: ['isBlank:post-nav-slideshow-post-blank'],

  isOutgoing: oneWay('post.isOutgoing'),
  isIncoming: oneWay('post.isIncoming'),
  isBlank: oneWay('post.isBlank'),
  keyboardActivated: oneWay('isCurrentPost'),
  shouldRenderPost: or('visible', 'post.shouldPrerender'),

  intl: service(),
  messageBus: service(),
  modalManager: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    const nsfw = this.get('post.nsfw');

    this.get('messageBus').subscribe('enabledNsfw', this, () => this.notifyPropertyChange('nsfw'));
  },

  _keyExpandCompressText: on(keyDown('KeyX'), function() {
    this.$('.post-nav-post-text').focus();
    this.get('textExpanded') ? this.attrs.compressText() : this.attrs.expandText();
    this.set('userRevealedText', true);
  }),

  isCurrentPost: computed('post', 'navState.currentPanel.post', {
    get() {
      return this.get('post') === this.get('navState.currentPanel.post');
    }
  }),

  nsfw: computed({
    get() {
      return this.get('post.model.nsfw') && !(localStorage.getItem('showNsfwContent') || sessionStorage.getItem('showNsfwContent'));
    }
  }),

  resizeType: computed('panelCompressed', {
    get() {
      return this.get('panelCompressed') ? 'expand' : 'compress'
    }
  }),

  actions: {
    compress() {
      this.attrs.expandText();
    },

    expand() {
      this.attrs.compressText();
    },

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
