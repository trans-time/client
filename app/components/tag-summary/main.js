import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay, gt, filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

const Summary = EmberObject.extend({
  selected: false,
  selectedPostIds: oneWay('component.selectedPostIds'),
  isValid: gt('amount', 0),
  amount: computed('selectedPostIds.[]', {
    get() {
      const { postIds, selectedPostIds } = this.getProperties('postIds', 'selectedPostIds');

      if (selectedPostIds.length === 0) return postIds.length;

      const validTagPostIds = selectedPostIds.filter((id) => postIds.includes(id));

      return validTagPostIds.length;
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

  selectedPostIds: computed('selectedTags.[]', 'selectedRelationships.[]', {
    get() {
      const { selectedRelationships, selectedTags } = this.getProperties('selectedRelationships', 'selectedTags');
      const selectedSummaries = selectedRelationships.concat(selectedTags);

      if (isEmpty(selectedSummaries)) return [];

      const postIdSets = selectedSummaries.map((summary) => summary.get('postIds')).sort((a, b) => a.length - b.length);
      const smallestSet = postIdSets.shift();

      return smallestSet.reduce((selectedPostIds, postId) => {
        if (postIdSets.every((postIdSet) => postIdSet.includes(postId))) selectedPostIds.pushObject(postId);

        return selectedPostIds;
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
          postIds: tagSummary[id],
          component: this
        })
      })).sort((a, b) => b.get('postIds.length') - a.get('postIds.length'));
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
          postIds: tagSummary[id],
          component: this
        })
      })).sort((a, b) => b.get('postIds.length') - a.get('postIds.length'));
    }
  }),

  actions: {
    toggleTag(tag) {
      tag.toggleProperty('selected');
    }
  }
});
