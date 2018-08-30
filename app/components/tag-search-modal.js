import Component from '@ember/component';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['main-modal-content', 'tag-search-modal'],
  selected: 'all',

  modalManager: service(),
  router: service(),

  author: oneWay('options.author'),
  tag: oneWay('options.tag'),
  tags: oneWay('options.tags'),
  user: oneWay('options.user'),
  users: oneWay('options.users'),

  didReceiveAttrs() {
    const { author, tag, tags, user, users } = this.getProperties('author', 'tag', 'tags', 'user', 'users');

    if (author) this.set('selected', 'author');

    if (tags) {
      this.set('selectedTags', tags.map((thisTag) => {
        return {
          name: thisTag,
          selected: thisTag === tag
        }
      }));
    }

    if (users) {
      this.set('selectedUsers', users.map((thisUser) => {
        return {
          name: thisUser,
          selected: thisUser === user
        }
      }));
    }

    return this._super(...arguments);
  },

  actions: {
    goToProfile(username) {
      this.get('router').transitionTo('users.user.profile', username);

      this.get('modalManager').close();
    },

    select(selection) {
      this.set('selected', selection);
    },

    search() {
      if (this.get('selected') === 'all') {
        this.get('router').transitionTo('search', { queryParams: { query: this.get('selectedTags').filter((tag) => tag.selected).map((tag) => `#${tag.name}`).join(' ') } });
      } else {
        this.get('router').transitionTo('users.user.timeline', this.get('author.username'), {
          refreshModel: true,
          queryParams: {
            timelineItemId: null,
            relationships: this.get('selectedUsers').filter((tag) => tag.selected).map((user) => user.name),
            tags: this.get('selectedTags').filter((user) => user.selected).map((tag) => tag.name)
          }
        });
      }

      this.get('modalManager').close();
    }
  }
});
