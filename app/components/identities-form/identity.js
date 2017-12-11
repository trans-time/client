import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['identities-form-identity'],

  endDateId: computed({
    get() {
      return `${guidFor(this)}_end_date`;
    }
  }),

  startDateId: computed({
    get() {
      return `${guidFor(this)}_start_date`;
    }
  }),

  actions: {
    removeUserIdentity() {
      this.attrs.removeUserIdentity();
    }
  }
});
