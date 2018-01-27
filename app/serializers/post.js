import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    panels: { serialize: true },
    currentUserReaction: { serialize: false },
    totalComments: { serialize: false },
    totalMoons: { serialize: false },
    totalStars: { serialize: false },
    totalSuns: { serialize: false }
  }
});
