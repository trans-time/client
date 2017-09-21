import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,
  description: faker.lorem.paragraph,

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10);

    user.save();
  }
});
