import { A } from '@ember/array';
import DS from 'ember-data';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default DS.Model.extend({
  userTagSummariesAboutUser: DS.hasMany('user-tag-summary', { inverse: 'subject' }),
  userTagSummariesByUser: DS.hasMany('user-tag-summary', { inverse: 'author' }),
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
  currentUser: DS.belongsTo('current-user'),
  userProfile: DS.belongsTo('user-profile'),
  verdicts: DS.hasMany('verdict'),

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

  avatarOrDummy: computed('avatar', {
    get() {
      const src = this.get('avatar');

      return isNone(src) ? '/default_avatar/full.jpeg' : src;
    }
  }),

  avatarThumb: computed('avatarOrDummy', {
    get() {
      const src = this.get('avatarOrDummy');

      if (isNone(src)) return;

      const src40 = src.replace('/full.', '/thumb_40.');
      const src80 = src.replace('/full.', '/thumb_80.');
      const src160 = src.replace('/full.', '/thumb_160.');

      return `${src40} 40w, ${src80} 80w, ${src160} 160w`;
    }
  }),

  avatarBigThumb: computed('avatarOrDummy', {
    get() {
      const src = this.get('avatarOrDummy');

      if (isNone(src)) return;

      const src80 = src.replace('/full.', '/thumb_80.');
      const src160 = src.replace('/full.', '/thumb_160.');
      const src320 = src.replace('/full.', '/thumb_320.');

      return `${src80} 80w, ${src160} 160w, ${src320} 320w`;
    }
  }),

  avatarProfile: computed('avatarOrDummy', {
    get() {
      const src = this.get('avatarOrDummy');

      if (isNone(src)) return;

      const src160 = src.replace('/full.', '/thumb_160.');
      const src320 = src.replace('/full.', '/thumb_320.');
      const src640 = src.replace('/full.', '/thumb_640.');

      return `${src160} 160w, ${src320} 320w, ${src640} 640w`;
    }
  }),

  avatarFull: computed('avatarOrDummy', {
    get() {
      return this.get('avatarOrDummy');
    }
  })
});
