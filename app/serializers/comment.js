import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    totalMoons: { serialize: false },
    totalStars: { serialize: false },
    totalSuns: { serialize: false }
  }
});
