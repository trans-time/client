import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    switch (parseInt(serialized, 10)) {
      case 1: return 'star';
      case 2: return 'sun';
      case 3: return 'moon';
    }
  },

  serialize(deserialized) {
    switch (deserialized) {
      case 'star': return 1;
      case 'sun': return 2;
      case 'moon': return 3;
    }
  }
});
