import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  notificationCommentAt: DS.belongsTo('notification-comment-at'),
  notificationTimelineItemAt: DS.belongsTo('notification-timeline-item-at'),

  insertedAt: DS.attr('date'),
  read: DS.attr('boolean'),
  seen: DS.attr('boolean'),

  notifiable: computed({
    get() {
      return this.get('notificationCommentAt.content')
        || this.get('notificationTimelineItemAt.content');
    }
  })
});
