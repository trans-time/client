import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,
  description: faker.lorem.paragraph,
  tagSummary: {},

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10);

    user.tagSummary = user.posts.models.reduce((tags, post) => {
      return tags.concat(server.db.tags.find(post.tagIds));
    }, []).reduce((summary, tag) => {
      summary[tag.name] = (summary[tag.name] || 0) + 1;

      return summary;
    }, {});

    user.save();
  }
});
