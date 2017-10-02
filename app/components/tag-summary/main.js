import Ember from 'ember';

const Category = Ember.Object.extend({
  selectedPostIds: Ember.computed.oneWay('component.selectedPostIds'),
  tags: Ember.computed(() => Ember.A()),
  selectedTags: Ember.computed.filterBy('tags', 'selected')
});

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

  selectedTagIds: Ember.computed.mapBy('selectedTags', 'id'),
  selectedTags: Ember.computed('categories.@each.selectedTags', {
    get() {
      return this.get('categories').reduce((selectedTags, category) => {
        return selectedTags.concat(category.get('selectedTags'));
      }, []);
    }
  }),
  duplicateSelectedPostIds: Ember.computed('selectedTags.[]', {
    get() {
      return this.get('selectedTags').reduce((duplicateSelectedPostIds, tag) => {
        return duplicateSelectedPostIds.concat(tag.get('postIds'));
      }, []);
    }
  }),
  selectedPostIds: Ember.computed('selectedTags.[]', {
    get() {
      const selectedTags = this.get('selectedTags');

      if (Ember.isEmpty(selectedTags)) return [];

      const postIdSets = selectedTags.map((tag) => tag.get('postIds')).sort((a, b) => a.length - b.length);
      const smallestSet = postIdSets.shift();

      return smallestSet.reduce((selectedPostIds, postId) => {
        if (postIdSets.every((postIdSet) => postIdSet.includes(postId))) selectedPostIds.push(postId);

        return selectedPostIds;
      }, []);
    }
  }),

  categories: Ember.computed('tagSummary', {
    get() {
      const store = this.get('store');
      const tagSummary = this.get('tagSummary.summary');

      return Ember.A(Object.keys(tagSummary).reduce((categories, tagId) => {
        const tag = store.peekRecord('tag', tagId);
        const name = tag.get('tagCategory.name');
        const category = categories.find((category) => category.get('name') === name) || categories.pushObject(Category.create({
          name,
          component: this
        }));

        category.get('tags').pushObject(Tag.create({
          model: tag,
          id: tag.id,
          postIds: tagSummary[tagId],
          component: this
        }))

        return categories;
      }, []));
    }
  }),

  actions: {
    toggleTag(tag) {
      tag.toggleProperty('selected');
    }
  }
});
