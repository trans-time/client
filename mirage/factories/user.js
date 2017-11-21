import { Factory, faker } from 'ember-cli-mirage';
import { A } from '@ember/array';

export default Factory.extend({
  username: faker.internet.userName,

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10);

    user.userProfile = server.create('user-profile', {
      user
    });

    user.userConfiguration = server.create('user-configuration', {
      user,
      language: 'en-us',
      unitSystem: 'english',
      unitSystemVolume: 'english-us'
    });

    user.save();
  }
});
