import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  notificationCommentAt: DS.belongsTo('notification-comment-at'),
  notificationCommentComment: DS.belongsTo('notification-comment-comment'),
  notificationCommentReaction: DS.belongsTo('notification-comment-reaction'),
  notificationEmailConfirmation: DS.belongsTo('notification-email-confirmation'),
  notificationFollow: DS.belongsTo('notification-follow'),
  notificationModerationRequest: DS.belongsTo('notification-moderation-request'),
  notificationModerationResolution: DS.belongsTo('notification-moderation-resolution'),
  notificationModerationViolation: DS.belongsTo('notification-moderation-violation'),
  notificationPrivateGrant: DS.belongsTo('notification-private-grant'),
  notificationPrivateRequest: DS.belongsTo('notification-private-request'),
  notificationTimelineItemAt: DS.belongsTo('notification-timeline-item-at'),
  notificationTimelineItemComment: DS.belongsTo('notification-timeline-item-comment'),
  notificationTimelineItemReaction: DS.belongsTo('notification-timeline-item-reaction'),

  updatedAt: DS.attr('date'),
  isRead: DS.attr('boolean'),
  isSeen: DS.attr('boolean'),

  notifiable: computed({
    get() {
      return this.get('notificationCommentAt.content')
        || this.get('notificationCommentComment.content')
        || this.get('notificationCommentReaction.content')
        || this.get('notificationEmailConfirmation.content')
        || this.get('notificationFollow.content')
        || this.get('notificationModerationRequest.content')
        || this.get('notificationModerationResolution.content')
        || this.get('notificationModerationViolation.content')
        || this.get('notificationPrivateGrant.content')
        || this.get('notificationPrivateRequest.content')
        || this.get('notificationTimelineItemAt.content')
        || this.get('notificationTimelineItemComment.content')
        || this.get('notificationTimelineItemReaction.content')
    }
  })
});
