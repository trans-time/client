import { A } from '@ember/array';
import { faker } from 'ember-cli-mirage';

export default function(server) {
  ['face', 'facial_hair', 'hairline', 'hair', 'shoulders', 'arms', 'hands', 'chest', 'breasts', 'waist', 'hips', 'legs', 'feet', 'voice', 'affect', 'posture', 'art', 'drawing', 'animation', 'poetry', 'story', 'family', 'friends', 'work', 'school', 'sports'].forEach((name) => {
    server.create('tag', { name });
  });
  server.create('tag', { name: 'style' })
  const symbolTag = server.create('tag', { name: 'symbol' });
  let sequence = ['male', 'gq', 'female', 'gq'];
  for (let i = 0; i < 2; ++i) {
    sequence = sequence.concat(sequence);
  }
  const posts = server.createList('post', 1, {
    date: 0,
    tags: [symbolTag],
    panels: [],
    text: ":sunglasses:I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! "
  });

  sequence.forEach((gender, index) => {
    posts.push(server.create('post', {
      date: index * 1000000000,
      tags: [symbolTag],
      panels: [0, 45, 90, 135, 180, 225, 270, 315].map((orientation) => {
        return server.create('image', {
          src: `/dev/${gender}-${orientation}.png`
        })
      })
    }))
  });

  const currentUser = server.create('user', {
    posts
  });
  server.createList('user', 3);

  server.db.users.forEach((user) => {
    if (user.id === currentUser.id) return;
    server.create('follow', {
      followerId: currentUser.id,
      followedId: user.id
    });
    server.create('follow', {
      followerId: user.id,
      followedId: currentUser.id,
      requestedPrivate: true
    });
  });

  server.db.posts.forEach((post) => {
    post.relationshipIds = [...Array(faker.random.number(3))].map(() => {
      return faker.random.number(server.db.users.length - 1) + 1;
    });

    server.db.posts.update(post.id, post);
  });

  server.db.userTagSummaries.forEach((userTagSummary) => {
    const posts = server.db.posts.find(server.db.users.find(server.db.userProfiles.find(userTagSummary.userProfileId).userId).postIds);

    userTagSummary.summary = posts.reduce((summary, post) => {
      post.tagIds.forEach((tagId) => {
        summary.tags[tagId] = summary.tags[tagId] || [];
        summary.tags[tagId].push(post.id);
      });
      post.relationshipIds.forEach((relationshipId) => {
        summary.relationships[relationshipId] = summary.relationships[relationshipId] || [];
        summary.relationships[relationshipId].push(post.id);
      });

      return summary;
    }, { tags: {}, relationships: {} });

    userTagSummary.relationshipIds = A(posts.reduce((relationshipIds, post) => {
      return relationshipIds.concat(post.relationshipIds);
    }, [])).uniq();

    server.db.userTagSummaries.update(userTagSummary.id, userTagSummary);
  })
}
