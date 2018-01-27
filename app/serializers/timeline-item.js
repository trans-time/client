import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    totalComments: { serialize: false }
  }
});
