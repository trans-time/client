import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay, gt, filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

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

  store: service(),

  selectedRelationships: filterBy('relationships', 'selected'),
  selectedTags: filterBy('tags', 'selected'),

  selectedRelationshipIds: mapBy('selectedRelationships', 'id'),
  selectedTagIds: mapBy('selectedTags', 'id'),

  selectedTimelineItemIds: computed('selectedTags.[]', 'selectedRelationships.[]', {
    get() {
      const { selectedRelationships, selectedTags } = this.getProperties('selectedRelationships', 'selectedTags');
      const selectedSummaries = selectedRelationships.concat(selectedTags);

      if (isEmpty(selectedSummaries)) return [];

      const timelineItemIdSets = selectedSummaries.map((summary) => summary.get('timelineItemIds')).sort((a, b) => a.length - b.length);
      const smallestSet = timelineItemIdSets.shift();

      return smallestSet.reduce((selectedTimelineItemIds, timelineItemId) => {
        if (timelineItemIdSets.every((timelineItemIdSet) => timelineItemIdSet.includes(timelineItemId))) selectedTimelineItemIds.pushObject(timelineItemId);

        return selectedTimelineItemIds;
      }, A()).uniq();
    }
  }),

  relationships: computed('tagSummary.summary.relationships', {
    get() {
      const store = this.get('store');
      const tagSummary = this.get('tagSummary.summary.relationships');

      return A(Object.keys(tagSummary).map((id) => {
        return Summary.create({
          id,
          model: store.peekRecord('user', id),
          timelineItemIds: tagSummary[id],
          component: this
        })
      })).sort((a, b) => b.get('timelineItemIds.length') - a.get('timelineItemIds.length'));
    }
  }),

  tags: computed('tagSummary.summary.tags', {
    get() {
      const store = this.get('store');
      const tagSummary = this.get('tagSummary.summary.tags');

      return A(Object.keys(tagSummary).map((id) => {
        return Summary.create({
          id,
          model: store.peekRecord('tag', id),
          timelineItemIds: tagSummary[id],
          component: this
        })
      })).sort((a, b) => b.get('timelineItemIds.length') - a.get('timelineItemIds.length'));
    }
  }),

  actions: {
    toggleTag(tag) {
      tag.toggleProperty('selected');
    }
  }
});
