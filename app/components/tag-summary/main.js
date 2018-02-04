import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay, gt, filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed, get } from '@ember/object';

const Summary = EmberObject.extend({
  selected: false,
  selectedTimelineItemIds: oneWay('component.selectedTimelineItemIds'),
  isValid: gt('amount', 0),
  amount: computed('selectedTimelineItemIds.[]', {
    get() {
      const { timelineItemIds, selectedTimelineItemIds } = this.getProperties('timelineItemIds', 'selectedTimelineItemIds');

      if (selectedTimelineItemIds.length === 0) return timelineItemIds.length;

      const validTagTimelineItemIds = selectedTimelineItemIds.filter((id) => timelineItemIds.includes(id));

      return validTagTimelineItemIds.length;
    }
  })
})

export default Component.extend({
  tagName: '',

  currentUser: service(),
  store: service(),

  selectedUsers: filterBy('users', 'selected'),
  selectedTags: filterBy('tags', 'selected'),

  selectedUserIds: mapBy('selectedUsers', 'id'),
  selectedTagIds: mapBy('selectedTags', 'id'),

  selectedTimelineItemIds: computed('selectedTags.[]', 'selectedUsers.[]', {
    get() {
      const { selectedUsers, selectedTags } = this.getProperties('selectedUsers', 'selectedTags');
      const selectedSummaries = selectedUsers.concat(selectedTags);

      if (isEmpty(selectedSummaries)) return [];

      const timelineItemIdSets = selectedSummaries.map((summary) => summary.get('timelineItemIds')).sort((a, b) => a.length - b.length);
      const smallestSet = timelineItemIdSets.shift();

      return smallestSet.reduce((selectedTimelineItemIds, timelineItemId) => {
        if (timelineItemIdSets.every((timelineItemIdSet) => timelineItemIdSet.includes(timelineItemId))) selectedTimelineItemIds.pushObject(timelineItemId);

        return selectedTimelineItemIds;
      }, A()).uniq();
    }
  }),

  selectedUserIds: computed({
    get() {
      return [this.get('userId')];
    }
  }),

  users: computed('_privateFollowedIds', {
    get() {
      return this._generateSummaries('user');
    }
  }),

  tags: computed('_privateFollowedIds', {
    get() {
      return this._generateSummaries('tag');
    }
  }),

  _privateFollowedIds: computed('currentUser.user.followeds.@each.canViewPrivate', {
    get() {
      return (this.get('currentUser.user.followeds') || []).
        filter((follow) => follow.get('canViewPrivate')).
        map((follow) => follow.get('followed.id'));
    }
  }),

  _generateSummaries(type) {
    const store = this.get('store');
    const tagSummary = this.get('tagSummary.summary');
    const privateFollowedIds = this.get('_privateFollowedIds');

    return this.get('selectedUserIds').reduce((summaries, userId) => {
      const privateTimelineItemIds = get(tagSummary, `${userId}.private`);
      const items = get(tagSummary, `${userId}.${type}s`);

      Object.keys(items).forEach((itemId) => {
        let timelineItemIds = items[itemId];
        if (!privateFollowedIds.includes(userId)) timelineItemIds = timelineItemIds.filter((id) => !privateTimelineItemIds.includes(id));

        if (timelineItemIds.length > 0) {
          const previousSummary = summaries.find((summary) => summary.get('id') === itemId);

          if (previousSummary) {
            previousTimelineItemIds = previousSummary.get('timelineItemIds');
            timelineItemIds.forEach((timelineItemId) => {
              if (!previousTimelineItemIds.includes(timelineItemId)) previousTimelineItemIds.push(timelineItemId);
            });
          } else {
            summaries.pushObject(Summary.create({
              id: itemId,
              model: store.peekRecord(type, itemId),
              timelineItemIds,
              component: this
            }))
          }
        }
      });

      return summaries;
    }, A()).sort((a, b) => b.get('timelineItemIds.length') - a.get('timelineItemIds.length'));
  },

  actions: {
    toggleTag(tag) {
      tag.toggleProperty('selected');
    }
  }
});
