import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  text: faker.lorem.paragraphs,
  totalStars: faker.random.number,
  totalSuns: faker.random.number,
  totalMoons: faker.random.number,
  totalFaves() {
    return this.totalStars + this.totalSuns + this.totalMoons;
  },

  afterCreate(post, server) {
    // if (post.images.length === 0) post.images = server.createList('image', faker.random.number(6));
    if (post.tags.length === 0) post.tagIds = [...Array(faker.random.number(6))].map(() => {
      return faker.random.number(server.db.tags.length - 1) + 1;
    });

    post.save();
  }
});
