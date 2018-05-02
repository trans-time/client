import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.date = snapshot.record.get('date');
    json.data.attributes.private = snapshot.record.get('private');
    json.data.attributes.nsfw = snapshot.record.get('nsfw');
    json.data.attributes.nsfw_butt = snapshot.record.get('nsfwButt');
    json.data.attributes.nsfw_genitals = snapshot.record.get('nsfwGenitals');
    json.data.attributes.nsfw_nipples = snapshot.record.get('nsfwNipples');
    json.data.attributes.nsfw_underwear = snapshot.record.get('nsfwUnderwear');

    return json;
  }
});
