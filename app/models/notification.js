import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  notificationCommentAt: DS.belongsTo('notification-comment-at'),

  insertedAt: DS.attr('date'),
  read: DS.attr('boolean'),
  seen: DS.attr('boolean'),

  notifiable: computed('notificationCommentAt', {
    get() {
      return this.get('notificationCommentAt');
    }
  })
});
