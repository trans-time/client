import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import DS from 'ember-data';
import Reactable from './reactable';

export default Reactable.extend({
  user: DS.belongsTo('user', { inverse: 'posts' }),
  comments: DS.hasMany('comment'),
  flags: DS.hasMany('flag', { inverse: 'flaggable' }),
  panels: DS.hasMany('panel', { polymorphic: true }),
  relationships: DS.hasMany('user', { inverse: false }),
  tags: DS.hasMany('tag'),

  commentsLocked: DS.attr('boolean'),
  date: DS.attr('number'),
  deleted: DS.attr('boolean'),
  private: DS.attr('boolean'),
  nsfw: DS.attr('boolean'),
  text: DS.attr('string'),
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
