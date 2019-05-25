import DS from 'ember-data';
import { alias } from '@ember/object/computed';

export default DS.Model.extend({
  description: DS.attr('string'),
  postCount: DS.attr('number'),
  website: DS.attr('string'),
  textVersions: DS.hasMany('text-version'),

  user: DS.belongsTo('user'),

  avatar: alias('user.avatar'),
  displayName: alias('user.displayName'),
  pronouns: alias('user.pronouns'),
  username: alias('user.username')
});
