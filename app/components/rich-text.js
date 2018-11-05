import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  modalManager: service(),

  tags: computed({
    get() {
      return (this.get('text').match(/#([a-zA-Z0-9_]*)/g) || []).map((tag) => tag.slice(1)).filter((tag, index, self) => self.indexOf(tag) === index);
    }
  }),

  users: computed({
    get() {
      return (this.get('text').match(/@([a-zA-Z0-9_]*)/g) || []).map((user) => user.slice(1)).filter((user, index, self) => self.indexOf(user) === index);
    }
  }),

  didInsertElement(...args) {
    this._super(...args);

    this.element.querySelectorAll('[data-tag]').forEach((element) => {
      element.addEventListener('touchstart', () => {
        element.dataset.recentlyTouched = true;

        setTimeout(() => delete element.dataset.recentlyTouched, 500);
      });

      ['click', 'touchend', 'keyup'].forEach((type) => {
        element.addEventListener(type, (event) => {
          if (event.code && event.code !== 'Enter') return;
          if (type === 'touchend' && !element.dataset.recentlyTouched) return;
          event.preventDefault();
          event.stopPropagation();
          const { tags, users, author } = this.getProperties('tags', 'users', 'author');

          this.get('modalManager').open('tag-search-modal', () => {}, () => {}, { author, tags, users, tag: element.dataset.tag });
        });
      });
    });

    this.element.querySelectorAll('[data-username]').forEach((element) => {
      element.addEventListener('touchstart', () => {
        element.dataset.recentlyTouched = true;

        setTimeout(() => delete element.dataset.recentlyTouched, 500);
      });

      ['click', 'touchend', 'keyup'].forEach((type) => {
        element.addEventListener(type, (event) => {
          if (event.code && event.code !== 'Enter') return;
          if (type === 'touchend' && !element.dataset.recentlyTouched) return;
          event.preventDefault();
          event.stopPropagation();
          const { tags, users, author } = this.getProperties('tags', 'users', 'author');

          this.get('modalManager').open('tag-search-modal', () => {}, () => {}, { author, tags, users, user: element.dataset.username });
        });
      });
    });
  }
});
