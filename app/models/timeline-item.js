import DS from 'ember-data';
import { computed } from '@ember/object';
import Flaggable from 'client/mixins/model-flaggable';
import Reactable from 'client/mixins/model-reactable';

export default DS.Model.extend(Flaggable, Reactable, {
  comments: DS.hasMany('comment'),
  post: DS.belongsTo('post'),
  tags: DS.hasMany('tag'),
  user: DS.belongsTo('user', { inverse: 'posts' }),
  users: DS.hasMany('user', { inverse: false }),

  commentCount: DS.attr('number'),
  commentsAreLocked: DS.attr('boolean'),
  date: DS.attr('date'),
  isMarkedForDeletion: DS.attr('boolean'),
  maturityRating: DS.attr('number', { defaultValue: 0 }),
  isPrivate: DS.attr('boolean'),
  isUnderModeration: DS.attr('boolean'),

  timelineable: computed('post', {
    get() {
      return this.get('post');
    }
  })
});
