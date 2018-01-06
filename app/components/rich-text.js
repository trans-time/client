import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  didInsertElement(...args) {
    this._super(...args);

    this.element.querySelectorAll('[data-tag]').forEach((element) => {
      ['click', 'touchend', 'keyup'].forEach((type) => {
        element.addEventListener(type, (event) => {
          if (event.code && event.code !== 'Enter') return;
          event.preventDefault();
          event.stopPropagation();
          this.get('router').transitionTo('search', { queryParams: { query: element.dataset.tag } });
        });
      });
    });

    this.element.querySelectorAll('[data-username]').forEach((element) => {
      ['click', 'touchend', 'keyup'].forEach((type) => {
        element.addEventListener(type, (event) => {
          if (event.code && event.code !== 'Enter') return;
          event.preventDefault();
          event.stopPropagation();
          this.get('router').transitionTo('users.user.profile', element.dataset.username);
        });
      });
    });
  }
});
