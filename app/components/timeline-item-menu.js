import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, {
  currentUser: service(),
  intl: service(),
  modalManager: service(),
  router: service(),
  store: service(),
  user: alias('currentUser.user'),

  showHistoryToggle: computed({
    get() {
      return this.get('isModerating') && this.get('timelineItem.post.textVersions.length') > 0;
    }
  }),

  actions: {
    delete(comment) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('post.deleteConfirmation') });
      }).then(() => {
        new Promise((resolve, reject) => {
          this.attrs.deletePost(resolve, reject);
        }).then(() => {
          this.attrs.removePost();
        });
      });
    },

    goToEdit() {
      this.get('router').transitionTo('posts.post.edit', this.get('timelineItem.post.id'));
    },

    report() {
      this.authenticatedAction().then(() => {
        new Promise((resolve, reject) => {
          this.get('modalManager').open('flag-modal', resolve, reject, {
            flag: this.get('store').createRecord('flag', {
              user: this.get('currentUser.user'),
              flaggable: this.get('timelineItem')
            })
          });
        });
      });
    },

    toggleHistory() {
      this.attrs.toggleHistory();
    }
  }
});
