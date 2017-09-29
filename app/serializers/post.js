import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    const json = this._super(...arguments);

    delete json.data.relationships['current-user-fav'];
    delete json.data.attributes['total-stars'];
    delete json.data.attributes['total-suns'];
    delete json.data.attributes['total-moons'];
    delete json.data.attributes['total-faves'];

    return json;
  }
});
