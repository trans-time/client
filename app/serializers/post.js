import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    currentUserReaction: { serialize: false },
    commentCount: { serialize: false },
    moonCount: { serialize: false },
    starCount: { serialize: false },
    sunCount: { serialize: false }
  },

  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.date = snapshot.record.get('date');
    json.data.attributes.private = snapshot.record.get('private');

    return json;
  }
});
