import PaperInput from 'ember-paper/components/paper-input';
import { bind } from '@ember/runloop';
import { EKMixin } from 'ember-keyboard';

export default PaperInput.extend(EKMixin, {
  didInsertElement() {
    ['input', 'textarea'].forEach((type) => {
      const element = this.element.querySelector(type);

      if (element) {
        element.addEventListener('focus', bind(this, this._gainFocus));
        element.addEventListener('blur', bind(this, this._loseFocus));
      }
    });

    return this._super(...arguments);
  },

  _gainFocus() {
    this.setProperties({
      keyboardActivated: true,
      keyboardFirstResponder: true
    });
  },

  _loseFocus() {
    this.setProperties({
      keyboardActivated: false,
      keyboardFirstResponder: false
    });
  }
});
