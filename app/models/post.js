import DS from 'ember-data';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Timelineable from './timelineable';

export default Timelineable.extend({
  user: DS.belongsTo('user', { inverse: 'posts' }),
  flags: DS.hasMany('flag', { inverse: 'flaggable' }),
  panels: DS.hasMany('panel', { polymorphic: true }),

  nsfw: DS.attr('boolean'),
  text: DS.attr('string'),

  date: alias('timelineItem.date'),
  private: alias('timelineItem.private'),

  panelsWithBlank: computed('panels.[]', {
    get() {
      const panels = this.get('panels');

      return panels.get('length') === 0 ? A([this.get('_blankPanel')]) : A(panels.toArray());
    }
  }),

  _blankPanel: computed({
    get() {
      return EmberObject.create({ postNavComponent: 'timeline-item-nav/slideshow/post/blank', post: { content: this } });
    }
  })
});
