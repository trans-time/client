import { Factory, faker } from 'ember-cli-mirage';
import { A } from '@ember/array';

export default Factory.extend({
  avatar: faker.image.avatar,
  description: faker.lorem.paragraph,
  displayName: faker.name.firstName,
  pronouns: faker.list.random('she/her', 'he/him', 'they/them', 'she/her; they/them', 'he/him; they/them', ''),
  totalPosts: faker.random.number,
  website: faker.internet.url,

  afterCreate(userProfile, server) {
    const summary = userProfile.user.posts.models.reduce((summary, post) => {
      post.tagIds.forEach((tagId) => {
        summary[tagId] = summary[tagId] || [];
        summary[tagId].push(post.id);
      });

      return summary;
    }, {});

    const tagIds = A(userProfile.user.posts.models.reduce((tagIds, post) => {
      return tagIds.concat(post.tagIds);
    }, [])).uniq();

    userProfile.userTagSummary = server.create('user-tag-summary', {
      userProfile,
      tagIds,
      summary
    }).save();

    userProfile.totalPosts = userProfile.user.posts.models.length;

    userProfile.save();
  }
});
