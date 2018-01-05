import TextField from '@ember/component/text-field';
import { on } from '@ember/object/evented';
import { EKOnFocusMixin, keyDown } from 'ember-keyboard';

export default TextField.extend(EKOnFocusMixin, {
  _performSearchOnKey: on(keyDown('Enter'), function() {
    this.attrs.performSearch(this.get('value'));
  }),

  actions: {
    search() {
      this.attrs.performSearch(this.get('value'));
    }
  }
});
