import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['row'],
  tagName: 'fieldset',

  id: Ember.computed('element.id', {
    get() {
      return `${this.get('element.id')}_input`;
    }
  })
});
