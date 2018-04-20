import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  currentUser: service(),

  model(params) {
    return hash({
      report: this.store.findRecord('moderation-report', params.id, {
        include: 'verdicts,verdicts.moderator,indicted,indicted.indictions,indicted.indictions.flags,indicted.indictions.verdicts,indicted.indictions.verdicts.moderator,flags,post,post.text_versions,post.images,post.timeline_item.user,comment,comment.text_versions,comment.images,comment.timeline_item.user',
        reload: true
      }),
      verdict: this.store.createRecord('verdict', {
        moderator: this.get('currentUser.user')
      })
    });
  },

  actions: {
    deleteTimelineable(post, resolve) {
      post.destroyRecord().finally(() => resolve());
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstPost: true } : { reachedLastPost: true });
    }
  }
});
