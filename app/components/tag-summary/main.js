import Ember from 'ember';

const Tag = Ember.Object.extend({
  selected: false,
  selectedPostIds: Ember.computed.oneWay('component.selectedPostIds'),
  isValid: Ember.computed.gt('amount', 0),
  amount: Ember.computed('selectedPostIds.[]', {
    get() {
      const { postIds, selectedPostIds } = this.getProperties('postIds', 'selectedPostIds');

      if (selectedPostIds.length === 0) return postIds.length;

      const validTagPostIds = selectedPostIds.filter((id) => postIds.includes(id));

      return validTagPostIds.length;
    }
  })
})

export default Ember.Component.extend({
  classNames: ['tag-summary'],

  store: Ember.inject.service(),

  selectedTags: Ember.computed.filterBy('tags', 'selected'),

  selectedTagIds: Ember.computed.mapBy('selectedTags', 'id'),
  selectedPostIds: Ember.computed('selectedTags.[]', {
    get() {
      const selectedTags = this.get('selectedTags');

      if (Ember.isEmpty(selectedTags)) return [];

      const postIdSets = selectedTags.map((tag) => tag.get('postIds')).sort((a, b) => a.length - b.length);
      const smallestSet = postIdSets.shift();

      return smallestSet.reduce((selectedPostIds, postId) => {
        if (postIdSets.every((postIdSet) => postIdSet.includes(postId))) selectedPostIds.pushObject(postId);

        return selectedPostIds;
      }, Ember.A()).uniq();
    }
  }),

  tags: Ember.computed('tagSummary.summary', {
    get() {
      const store = this.get('store');
      const tagSummary = this.get('tagSummary.summary');

      return Ember.A(Object.keys(tagSummary).map((id) => {
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
