import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),
  intl: service(),

  transitionToNotification() {
    this.get('router').transitionTo('comments.comment', this.get('notification.notifiable.comment.id'));
  },

  _commentingOn: computed({
    get() {
      const comment = this.get('notification.notifiable.comment');
      return comment.get('parent.content') || comment.get('timelineItem.content');
    }
  }),

  respondingToUser: computed({
    get() {
      const user = this.get('_commentingOn.user.content');

      return user === this.get('currentUser.user') ?
        this.get('intl').t('possessive.your') :
        this.get('intl').t('possessive.name', {name: user.get('username')});
    }
  }),

  respondingToType: computed({
    get() {
      const modelName = this.get('_commentingOn.constructor.modelName');

      switch (modelName) {
        case 'timeline-item': return this.get('intl').t('timelineItem.timelineItem');
        case 'comment': return this.get('intl').t('comments.comment');
      }
    }
  }),

  respondingToText: computed({
    get() {
      const modelName = this.get('_commentingOn.constructor.modelName');

      switch (modelName) {
        case 'timeline-item': return this.get('_commentingOn.post.text');
        case 'comment': return this.get('_commentingOn.text');
      }
    }
  })
});
