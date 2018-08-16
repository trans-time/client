import PaperMenuContentInner from 'ember-paper/components/paper-menu-content-inner';

export default PaperMenuContentInner.extend({
  didInsertElement() {
    Ember.run.later(() => {
      let focusTarget = this.$().find('.md-menu-focus-target');
      if (!focusTarget.length) {
        focusTarget = this.get('enabledMenuItems.firstObject.element.firstElementChild');
      }
      if (focusTarget) {
        focusTarget.focus();
      }
    });
  }
});
