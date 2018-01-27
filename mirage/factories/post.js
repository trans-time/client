import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  text: faker.lorem.paragraphs,
  totalMoons: faker.random.number,
  totalStars: faker.random.number,
  totalSuns: faker.random.number,

  afterCreate(post, server) {
    // if (post.images.length === 0) post.images = server.createList('image', faker.random.number(6));

    // post.timelineItemId = server.create('timeline-item', {
    //   timelineableId: {
    //     type: 'post',
    //     id: post.id
    //   },
    //   userId: post.userId
    // }).id;

    post.save();
  }
});
