import { A } from '@ember/array';
import { isBlank, isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay, gt, filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed, get } from '@ember/object';
import { capitalize } from '@ember/string';
import { pluralize } from 'ember-inflector';

const Summary = EmberObject.extend({
  selected: computed('component.selectedTagNames', 'component.selectedUserNames', {
    get() {
      return this.get('type') === 'tag' ?
        this.get('component.selectedTagNames').includes(this.get('model.name')) :
        this.get('component.selectedUserNames').includes(this.get('model.username'));
    }
  }),
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
  router: service(),

  selectedUsers: filterBy('users', 'selected'),
  selectedTags: filterBy('tags', 'selected'),

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

  sourceUsernames: computed('selectedUserNames.[]', {
    get() {
      return this.get('selectedUserNames').concat([this.get('tagSummaries.firstObject.subject.username')]);
    }
  }),

  users: computed('sourceUsernames.[]', '_privateFollowedIds', {
    get() {
      return this._generateSummaries('user');
    }
  }),

  tags: computed('sourceUsernames.[]', '_privateFollowedIds', {
    get() {
      return this._generateSummaries('tag');
    }
  }),

  _privateFollowedUsernames: computed('currentUser.user.followeds.@each.canViewPrivate', {
    get() {
      return (this.get('currentUser.user.followeds') || []).
        filter((follow) => follow.get('canViewPrivate')).
        map((follow) => follow.get('followed.username'));
    }
  }),

  _generateSummaries(type) {
    const privateFollowedUsernames = this.get('_privateFollowedUsernames');
    const tagSummaries = this.get('tagSummaries');

    return this.get('sourceUsernames').reduce((summaries, username) => {
      const tagSummary = tagSummaries.find((summary) => summary.get('author.username') === username);

      if (isBlank(tagSummary)) return summaries;

      const privateTimelineItemIds = get(tagSummary, 'privateTimelineItemIds');
      const items = get(tagSummary, `userTagSummary${pluralize(capitalize(type))}`);

      items.forEach((item) => {
        let timelineItemIds = item.get('timelineItemIds');
        if (!privateFollowedUsernames.includes(username)) timelineItemIds = timelineItemIds.filter((id) => !privateTimelineItemIds.includes(id));

        if (timelineItemIds.length > 0) {
          console.log(item)
          const itemId = item.get(`${type}.id`);
          const previousSummary = summaries.find((summary) => summary.get('id') === itemId);

          if (previousSummary) {
            previousTimelineItemIds = previousSummary.get('timelineItemIds');
            timelineItemIds.forEach((timelineItemId) => {
              if (!previousTimelineItemIds.includes(timelineItemId)) previousTimelineItemIds.push(timelineItemId);
            });
          } else {
            summaries.pushObject(Summary.create({
              id: itemId,
              model: item.get(type),
              type,
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
      const type = tag.get('type');
      const { selectedTagNames, selectedUserNames } = this.getProperties('selectedTagNames', 'selectedUserNames');

      if (type === 'tag') {
        const tagName = tag.get('model.name');
        const tags = selectedTagNames.includes(tagName) ? selectedTagNames.filter((tag) => tag !== tagName) : selectedTagNames.concat([tagName]);
        this.get('router').transitionTo('users.user.profile.summary', { queryParams: { tags, users: selectedUserNames }})
      } else if (type === 'user') {
        const username = tag.get('model.username');
        const users = selectedUserNames.includes(username) ? selectedUserNames.filter((user) => user !== username) : selectedUserNames.concat([username]);
        this.get('router').transitionTo('users.user.profile.summary', { queryParams: { tags: selectedTagNames, users }})
      }
    }
  }
});
