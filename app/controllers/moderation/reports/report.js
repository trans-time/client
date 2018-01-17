import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  isComment: computed('model.flaggable.content.constructor.modelName', {
    get() {
      const isComment = this.get('model.flaggable.content.constructor.modelName') === 'comment';

      this.set('comments', isComment ? true : undefined);

      return isComment;
    }
  })
});
