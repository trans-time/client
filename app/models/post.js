import DS from 'ember-data';

export default DS.Model.extend({
  faves: DS.hasMany('fav', { inverse: 'post' }),
  currentUserFav: DS.belongsTo('fav'),
  images: DS.hasMany('image'),
  tags: DS.hasMany('tag'),
  user: DS.belongsTo('user'),

  text: DS.attr('string'),
  date: DS.attr('date'),
  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number'),
  totalMoons: DS.attr('number'),
  totalFaves: DS.attr('number'),

  panels: Ember.computed('images.[]', {
    get() {
      const images = this.get('images');

      return images.get('length') === 0 ? Ember.A([this.get('_blankPanel')]) : Ember.A(images.toArray());
    }
  }),

  firstPanel: Ember.computed('images.firstObject', {
    get() {
      return this.get('images.firstObject') || this.get('_blankPanel');
    }
  }),

  _blankPanel: Ember.computed({
    get() {
      return Ember.Object.create({ postNavComponent: 'post-nav/slideshow/blank', post: { content: this } });
    }
  })
});
