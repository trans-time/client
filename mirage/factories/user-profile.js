import { Factory, faker } from 'ember-cli-mirage';
import { A } from '@ember/array';

export default Factory.extend({
  description: faker.lorem.paragraph,
  totalPosts: faker.random.number,
  website: faker.internet.url,

  afterCreate(userProfile, server) {
    const summary = userProfile.user.timelineItems.models.reduce((summary, timelineItem) => {
      timelineItem.tagIds.forEach((tagId) => {
        summary[tagId] = summary[tagId] || [];
        summary[tagId].push(timelineItem.id);
      });

      return summary;
    }, {});

    const tagIds = A(userProfile.user.timelineItems.models.reduce((tagIds, timelineItem) => {
      return tagIds.concat(timelineItem.tagIds);
    }, [])).uniq();

    userProfile.userTagSummary = server.create('user-tag-summary', {
      userProfile,
      tagIds,
      summary
    }).save();

    userProfile.totalPosts = userProfile.user.timelineItems.models.length;

    userProfile.save();
  }
});
