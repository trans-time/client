import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  currentUserFav: DS.belongsTo('fav'),
  user: DS.belongsTo('user', { inverse: 'posts' }),
  comments: DS.hasMany('comment'),
  faves: DS.hasMany('fav', { inverse: 'post' }),
  panels: DS.hasMany('panel', { polymorphic: true }),
  relationships: DS.hasMany('user', { inverse: false }),
  tags: DS.hasMany('tag'),

  text: DS.attr('string'),
  date: DS.attr('number'),
  private: DS.attr('boolean'),
  nsfw: DS.attr('boolean'),
  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number'),
  totalMoons: DS.attr('number'),
  totalFaves: DS.attr('number'),

  panelsWithBlank: computed('panels.[]', {
    get() {
      const panels = this.get('panels');

      return panels.get('length') === 0 ? A([this.get('_blankPanel')]) : A(panels.toArray());
    }
  }),

  _blankPanel: computed({
    get() {
      return EmberObject.create({ postNavComponent: 'post-nav/slideshow/post/blank', post: { content: this } });
    }
  })
});
