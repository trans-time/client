import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    moonCount: { serialize: false },
    starCount: { serialize: false },
    sunCount: { serialize: false }
  }
});
