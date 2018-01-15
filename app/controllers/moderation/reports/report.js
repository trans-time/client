import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  comments: oneWay('isComment'),

  isComment: computed('model.flaggable.content.constructor.modelName', {
    get() {
      return this.get('model.flaggable.content.constructor.modelName') === 'comment';
    }
  })
});
