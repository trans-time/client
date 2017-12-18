import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comments'],

  store: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.get('store').query('comment', { postId: this.get('post.id'), include: 'user, user.userProfile' }).then((comments) => {
      this.set('comments', comments);
    });
  }
});
