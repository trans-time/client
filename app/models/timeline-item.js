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
  deleted: DS.attr('boolean'),
  nsfw: DS.attr('boolean'),
  nsfwButt: DS.attr('boolean'),
  nsfwGenitals: DS.attr('boolean'),
  nsfwNipples: DS.attr('boolean'),
  nsfwUnderwear: DS.attr('boolean'),
  private: DS.attr('boolean'),

  timelineable: computed('post', {
    get() {
      return this.get('post');
    }
  })
});
