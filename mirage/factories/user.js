import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,
  description: faker.lorem.paragraph,
  tagSummary: {},

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10);

    const summary = user.posts.models.reduce((summary, post) => {
      post.tagIds.forEach((tagId) => {
        summary[tagId] = summary[tagId] || [];
        summary[tagId].push(post.id);
      });

      return summary;
    }, {});

    const tagIds = Ember.A(user.posts.models.reduce((tagIds, post) => {
      return tagIds.concat(post.tagIds);
    }, [])).uniq();

    user.userTagSummary = server.create('user-tag-summary', {
      user,
      tagIds,
      summary
    });

    user.save();
  }
});
