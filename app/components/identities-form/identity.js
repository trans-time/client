import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@ember/component';
import UserIdentityDatesMixin from 'client/mixins/user-identity-dates';

export default Component.extend(UserIdentityDatesMixin, {
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
    expand() {
      this.toggleProperty('expanded');
    },

    removeUserIdentity() {
      this.attrs.removeUserIdentity();
    }
  }
});
