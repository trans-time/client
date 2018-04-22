import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  comments: DS.hasMany('comment'),
  post: DS.belongsTo('post'),
  tags: DS.hasMany('tag'),
  user: DS.belongsTo('user', { inverse: 'posts' }),
  users: DS.hasMany('user', { inverse: false }),

  date: DS.attr('date'),
  deleted: DS.attr('boolean'),
  private: DS.attr('boolean'),

  timelineable: computed('post', {
    get() {
      return this.get('post');
    }
  })
});
