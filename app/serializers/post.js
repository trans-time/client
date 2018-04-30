import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.date = snapshot.record.get('date');
    json.data.attributes.private = snapshot.record.get('private');
    json.data.attributes.nsfw = snapshot.record.get('nsfw');

    return json;
  }
});
