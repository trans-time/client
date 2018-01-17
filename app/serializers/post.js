import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    panels: { serialize: true },
    currentUserReaction: { serialize: false }
  }
});
