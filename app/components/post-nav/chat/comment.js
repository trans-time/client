import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment'],
  classNameBindings: ['isCollapsed'],

  childrenAreCollapsed: true,

  click(...args) {
    this._super(...args);

    this._wasClicked();
  },

  touchUp(...args) {
    this._super(...args);

    this._wasClicked();
  },

  _wasClicked() {
    if (this.attrs.wasClicked) this.attrs.wasClicked();
  },

  actions: {
    expandChildren() {
      this.set('childrenAreCollapsed', false);
    }
  }
});
