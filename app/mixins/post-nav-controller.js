import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['comments'],
  comments: null,

  actions: {
    changeTimelineItem(timelineItem) {
      this.set('timelineItemId', timelineItem.id);
    },

    openComments() {
      this.set('comments', true);
    },

    closeComments() {
      this.set('comments', undefined);
    }
  }
});
