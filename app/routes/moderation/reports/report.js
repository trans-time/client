import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(params) {
    return hash({
      report: this.store.findRecord('moderation-report', params.id, {
        include: 'verdicts,verdicts.moderator,indicted,indicted.indictions,indicted.indictions.flags,indicted.indictions.verdicts,indicted.indictions.verdicts.moderator,flags,timeline_item,timeline_item.content_warnings,timeline_item.post,timeline_item.post.text_versions,timeline_item.post.images,timeline_item.user,timeline_item.reactions,timeline_item.reactions.user,comment,comment.text_versions,comment.timeline_item,comment.timeline_item.post.images,comment.timeline_item.user',
        reload: true
      }),
      verdict: this.store.createRecord('verdict')
    });
  },

  actions: {
    deleteTimelineable(timelineable, resolve, reject) {
      timelineable.set('timelineItem.isMarkedForDeletion', true);
      timelineable.deleteRecord();

      timelineable.save().then(() => {
        resolve();
      }).catch(() => {
        timelineable.rollbackAttributes();
        reject();
      });
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstPost: true } : { reachedLastPost: true });
    }
  }
});
