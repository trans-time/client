import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    panels: { serialize: true },
    currentUserFav: { serialize: false }
  }
});
