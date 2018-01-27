import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  date: faker.date.past,
  deleted: false,

  afterCreate(timelineItem, server) {
    if (timelineItem.tags.length === 0) timelineItem.tagIds = [...Array(faker.random.number(6))].map(() => {
      return faker.random.number(server.db.tags.length - 1) + 1;
    });

    if (timelineItem.relationships.length === 0) timelineItem.relationshipIds = []

    timelineItem.save();
  }
});
