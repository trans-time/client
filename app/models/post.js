import DS from 'ember-data';

export default DS.Model.extend({
  currentUserFav: DS.belongsTo('fav'),
  user: DS.belongsTo('user'),
  faves: DS.hasMany('fav', { inverse: 'post' }),
  panels: DS.hasMany('panel', { polymorphic: true }),
  routineInstances: DS.hasMany('routine-instance'),
  tags: DS.hasMany('tag'),

  text: DS.attr('string'),
  date: DS.attr('date'),
  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number'),
  totalMoons: DS.attr('number'),
  totalFaves: DS.attr('number'),

  quantifiables: Ember.computed('routineInstances.[]', {
    get() {
      return this.get('routineInstances');
    }
  }),

  panelsWithBlank: Ember.computed('panels.[]', {
    get() {
      const panels = this.get('panels');

      return panels.get('length') === 0 ? Ember.A([this.get('_blankPanel')]) : Ember.A(panels.toArray());
    }
  }),

  _blankPanel: Ember.computed({
    get() {
      return Ember.Object.create({ postNavComponent: 'post-nav/slideshow/blank', post: { content: this } });
    }
  })
});
