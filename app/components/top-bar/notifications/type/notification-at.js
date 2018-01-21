import Component from '@ember/component';
import { computed } from '@ember/object';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  transitionToNotification() {
    if (this.get('isPost')) {
      this.get('router').transitionTo('posts.post', this.get('notification.reactable.id'));
    } else {
      this.get('router').transitionTo('comments.comment', this.get('notification.reactable.id'));
    }
  },

  isPost: computed({
    get() {
      return this.get('notification.reactable.content.constructor.modelName') === 'post';
    }
  }),

  otherTags: computed({
    get() {
      return this.get('notification.totalTags') - 1;
    }
  })
});
