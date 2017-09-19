import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'fieldset',

  id: Ember.computed('element.id', {
    get() {
      return `${this.get('element.id')}_input`;
    }
  })
});
