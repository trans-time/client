import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  text: faker.lorem.paragraph,
  date: faker.date.past,

  afterCreate(post, server) {
    post.images = server.createList('image', faker.random.number(6));
    post.tagIds = [...Array(faker.random.number(3))].map(() => {
      return faker.random.number(server.db.tags.length - 1) + 1;
    });

    post.save();
  }
});
