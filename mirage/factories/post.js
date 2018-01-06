import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  deleted: false,
  text: faker.lorem.paragraphs,

  afterCreate(post, server) {
    // if (post.images.length === 0) post.images = server.createList('image', faker.random.number(6));
    if (post.tags.length === 0) post.tagIds = [...Array(faker.random.number(6))].map(() => {
      return faker.random.number(server.db.tags.length - 1) + 1;
    });

    post.save();
  }
});
