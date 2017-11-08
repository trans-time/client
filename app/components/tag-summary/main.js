import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { oneWay, gt, filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

const Tag = EmberObject.extend({
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
  classNames: ['tag-summary'],

  store: service(),

  selectedTags: filterBy('tags', 'selected'),

  selectedTagIds: mapBy('selectedTags', 'id'),
  selectedPostIds: computed('selectedTags.[]', {
    get() {
      const selectedTags = this.get('selectedTags');

      if (isEmpty(selectedTags)) return [];

      const postIdSets = selectedTags.map((tag) => tag.get('postIds')).sort((a, b) => a.length - b.length);
      const smallestSet = postIdSets.shift();

      return smallestSet.reduce((selectedPostIds, postId) => {
        if (postIdSets.every((postIdSet) => postIdSet.includes(postId))) selectedPostIds.pushObject(postId);

        return selectedPostIds;
      }, A()).uniq();
    }
  }),

  tags: computed('tagSummary.summary', {
    get() {
      const store = this.get('store');
      const tagSummary = this.get('tagSummary.summary');

      return A(Object.keys(tagSummary).map((id) => {
        const model = store.peekRecord('tag', id);

        return Tag.create({
          id,
          model: store.peekRecord('tag', id),
          postIds: tagSummary[id],
          component: this
        })
      }));
    }
  }),

  actions: {
    toggleTag(tag) {
      tag.toggleProperty('selected');
    }
  }
});
