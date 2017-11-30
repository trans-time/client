import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  currentUserFav: DS.belongsTo('fav'),
  user: DS.belongsTo('user', { inverse: 'posts' }),
  faves: DS.hasMany('fav', { inverse: 'post' }),
  panels: DS.hasMany('panel', { polymorphic: true }),
  relationships: DS.hasMany('user', { inverse: false }),
  tags: DS.hasMany('tag'),

  text: DS.attr('string'),
  date: DS.attr('number'),
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
      return EmberObject.create({ postNavComponent: 'post-nav/slideshow/blank', post: { content: this } });
    }
  })
});
