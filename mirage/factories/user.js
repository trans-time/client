import { A } from '@ember/array';
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.userName,

  afterCreate(user, server) {
    if (user.posts.length === 0) user.posts = server.createList('post', 10, { date: 99999999999 });

    user.userProfile = server.create('user-profile', {
      user
    });

    user.currentUser = server.create('current-user', {
      user,
      language: 'en-us'
    });

    user.userIdentityIds = A([...Array(faker.random.number(4) + 1)].map(() => {
      const startDate = faker.random.number(100) > 50 ? undefined : faker.random.number(100000000000);
      const endDate = faker.random.number(100) > 50 ? undefined : (startDate || 0) + 999999999 + faker.random.number(1000000000000);
      return server.db.userIdentities.firstOrCreate({ startDate, endDate, identityId: faker.random.number(server.db.identities.length - 1) + 1 }).id;
    })).uniq();

    user.save();
  }
});
