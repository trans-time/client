import DS from 'ember-data';
import NotifiableMixin from 'client/mixins/model-notifiable';

export default DS.Model.extend(NotifiableMixin, {
  timelineItem: DS.belongsTo('timeline-item'),

  commentCount: DS.attr('number')
});
