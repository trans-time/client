import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    panels: { serialize: true },
    currentUserReaction: { serialize: false },
    totalMoons: { serialize: false },
    totalStars: { serialize: false },
    totalSuns: { serialize: false }
  },

  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.date = snapshot.record.get('date');
    json.data.attributes.private = snapshot.record.get('private');

    return json;
  }
});
