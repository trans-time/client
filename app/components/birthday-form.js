import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  intl: service(),
  paperToaster: service(),

  clear: false,

  actions: {
    updateBirthday(date) {
      this.currentUser.user.set('birthday', date);
      this.currentUser.user.save().then(() => {
        this.get('paperToaster').show(this.get('intl').t('users.birthdaySuccessfullyUpdate'), {
          duration: 4000
        });
      });
    }
  }
});
