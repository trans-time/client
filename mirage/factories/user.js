import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10);

    user.userProfile = server.create('user-profile', {
      user
    });

    user.currentUser = server.create('current-user', {
      user,
      language: 'en-us'
    });

    user.save();
  }
});
