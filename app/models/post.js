import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import DS from 'ember-data';
import Favable from './favable';

export default Favable.extend({
  user: DS.belongsTo('user', { inverse: 'posts' }),
  comments: DS.hasMany('comment'),
  panels: DS.hasMany('panel', { polymorphic: true }),
  relationships: DS.hasMany('user', { inverse: false }),
  tags: DS.hasMany('tag'),
  textVersions: DS.hasMany('text-version'),

  text: DS.attr('string'),
  date: DS.attr('number'),
  private: DS.attr('boolean'),
  nsfw: DS.attr('boolean'),
  totalComments: DS.attr('number'),

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
