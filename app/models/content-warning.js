import DS from 'ember-data';

export default DS.Model.extend({
  timelineItems: DS.hasMany('timeline-item'),

  name: DS.attr('string')
});
