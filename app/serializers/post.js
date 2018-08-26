import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.date = snapshot.record.get('date');
    json.data.attributes.is_private = snapshot.record.get('isPrivate');
    json.data.attributes.content_warnings = snapshot.record.get('contentWarnings');

    return json;
  }
});
