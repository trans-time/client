import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.avatar = snapshot.record.get('avatar');
    json.data.attributes.display_name = snapshot.record.get('displayName');
    json.data.attributes.pronouns = snapshot.record.get('pronouns');

    return json;
  }
});
