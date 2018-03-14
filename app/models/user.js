import { A } from '@ember/array';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  blockeds: DS.hasMany('block', { inverse: 'blocker' }),
  blockers: DS.hasMany('block', { inverse: 'blocked' }),
  comments: DS.hasMany('comment'),
  reactions: DS.hasMany('reaction'),
  followeds: DS.hasMany('follow', { inverse: 'follower' }),
  followers: DS.hasMany('follow', { inverse: 'followed' }),
  indictions: DS.hasMany('moderation-report', { inverse: 'indicted' }),
  notifications: DS.hasMany('notification', { polymorphic: true }),
  posts: DS.hasMany('post', { async: true, inverse: 'user' }),
  timelineItems: DS.hasMany('timeline-item', { async: true, inverse: 'user' }),
  userIdentities: DS.hasMany('user-identity'),
  userProfile: DS.belongsTo('user-profile'),
  moderationReports: DS.hasMany('moderation-report', { inverse: 'moderator' }),

  avatar: DS.attr('string'),
  email: DS.attr('string'),
  displayName: DS.attr('string'),
  isModerator: DS.attr('boolean'),
  password: DS.attr('string'),
  pronouns: DS.attr('string'),
  username: DS.attr('string'),

  tags: computed('timelineItems.@each.tag', {
    get() {
      return this.get('timelineItems').toArray().reduce((tags, timelineItem) => tags.concat(timelineItem.get('tags').toArray()), A()).uniq();
    }
  }),

  avatarThumb: computed('avatar', {
    get() {
      return this.get('avatar');
    }
  }),

  avatarBigThumb: computed('avatar', {
    get() {
      const avatar = this.get('avatar');

      if (avatar) return avatar.replace('thumb', 'big_thumb');
    }
  }),

  avatarProfile: computed('avatar', {
    get() {
      const avatar = this.get('avatar');

      if (avatar) return avatar.replace('thumb', 'profile');
    }
  }),

  avatarFull: computed('avatar', {
    get() {
      const avatar = this.get('avatar');

      if (avatar) return avatar.replace('thumb', 'full');
    }
  })
});
