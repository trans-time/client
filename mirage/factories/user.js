import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,

  afterCreate(user, server) {
    user.posts = server.createList('post', 10);

    user.save();
  }
});
