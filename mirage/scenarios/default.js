import { A } from '@ember/array';
import { faker } from 'ember-cli-mirage';

export default function(server) {
  ['face', 'facial_hair', 'hairline', 'hair', 'shoulders', 'arms', 'hands', 'chest', 'breasts', 'waist', 'hips', 'legs', 'feet', 'voice', 'affect', 'posture', 'art', 'drawing', 'animation', 'poetry', 'story', 'family', 'friends', 'work', 'school', 'sports'].forEach((name) => {
    server.create('tag', { name });
  });
  server.create('tag', { name: 'style' });
  ['trans_woman', 'trans_woman', 'nonbinary', 'genderqueer', 'asexual', 'bisexual', 'queer', 'vegan'].forEach((name) => {
    server.create('identity', { name });
  });
  const symbolTag = server.create('tag', { name: 'symbol' });
  let sequence = ['male', 'gq', 'female', 'gq'];
  for (let i = 0; i < 2; ++i) {
    sequence = sequence.concat(sequence);
  }
  const posts = server.createList('post', 1, {
    date: 0,
    panels: [],
    text: ":sunglasses: @celeste #symbol I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! "
  });

  sequence.forEach((gender, index) => {
    posts.push(server.create('post', {
      date: index * 1000000000,
      panels: [0, 45, 90, 135, 180, 225, 270, 315].map((orientation, index) => {
        return server.create('image', {
          src: `/dev/${gender}-${orientation}.png`,
          order: index
        })
      })
    }))
  });

  server.createList('user', 3);

  server.db.posts.forEach((post, index) => {
    post.relationshipIds = [...Array(faker.random.number(3))].map(() => {
      return faker.random.number(server.db.users.length - 1) + 1;
    });

    post.totalComments = 0;

    post.commentIds = [...Array(faker.random.number(3))].map(() => {
      post.totalComments++;

      const comment = server.create('comment', {
        postId: post.id,
        userId: faker.random.number(server.db.users.length - 1) + 1,
        date: Date.now(),
        deleted: faker.random.number(10) > 5
      });

      comment.childrenIds = [...Array(faker.random.number(2))].map(() => {
        post.totalComments++;

        return server.create('comment', {
          postId: post.id,
          userId: faker.random.number(server.db.users.length - 1) + 1,
          parentId: comment.id,
          date: Date.now()
        });
      });

      return comment.id;
    });


    server.create('timeline-item', {
      timelineableId: { type: 'post', id: post.id },
      userId: post.userId
    }).id;


    server.db.posts.update(post.id, post);
  });

  const violatingPost = server.db.posts.find(30);
  const violatingComment = server.db.comments.find(10);

  violatingPost.textVersionIds = server.createList('text-version', 4, {
    attribute: 'text',
    flaggableId: { type: 'post', id: violatingPost.id }
  }).map((version) => version.id);

  server.db.posts.update(violatingPost.id, violatingPost);

  violatingComment.textVersionIds = server.createList('text-version', 4, {
    attribute: 'text',
    flaggableId: { type: 'comment', id: violatingComment.id }
  }).map((version) => version.id);

  server.db.comments.update(violatingComment.id, violatingComment);

  server.create('moderation-report', {
    flagIds: server.createList('flag', 5).map((flag) => flag.id),
    moderatorId: 1,
    flaggableId: { type: 'post', id: violatingPost.id },
    indictedId: violatingPost.userId
  });

  server.create('moderation-report', {
    flagIds: server.createList('flag', 5).map((flag) => flag.id),
    moderatorId: 1,
    flaggableId: { type: 'comment', id: violatingComment.id },
    indictedId: violatingComment.userId
  });

  server.createList('moderation-report', 3, {
    flagIds: server.createList('flag', 5).map((flag) => flag.id),
    moderatorId: 2,
    wasViolation: true,
    indictedId: violatingPost.userId,
    moderatorComment: 'foo bar baz and lots of jazz, that is the comment I would like to make. That I would like to make this comment kinda long. That is all. Thank you. Peace.'
  });

  server.create('moderation-warning', {
    indictedId: 1,
    moderationReportId: 1
  });

  const currentUser = server.create('user', {
    posts,
    timelineItemIds: server.db.timelineItems.filter((timelineItem) => posts.includes(timelineItem.timelineableId.id)).map((timelineItem) => timelineItemd.id),
    username: 'celeste',
    isModerator: true,
    notificationIds: [{
      type: 'notification-at',
      id: server.create('notification-at', {
        user: currentUser,
        reactableId: {
          type: 'post',
          id: 1
        }
      }).id
    },
    {
      type: 'notification-comment',
      id: server.create('notification-comment', {
        user: currentUser,
        commentId: 1
      }).id
    },
    {
      type: 'notification-follow',
      id: server.create('notification-follow', {
        user: currentUser,
        followerId: 1
      }).id
    },
    {
      type: 'notification-moderation-request',
      id: server.create('notification-moderation-request', {
        user: currentUser,
        total: 3
      }).id
    },
    {
      type: 'notification-moderation-resolved',
      id: server.create('notification-moderation-resolved', {
        user: currentUser,
        flagId: 1
      }).id
    },
    {
      type: 'notification-moderation-warning',
      id: server.create('notification-moderation-warning', {
        user: currentUser,
        moderationWarningId: 1
      }).id
    },
    {
      type: 'notification-private-grant',
      id: server.create('notification-private-grant', {
        user: currentUser,
        followedId: 1
      }).id
    },
    {
      type: 'notification-private-request',
      id: server.create('notification-private-request', {
        user: currentUser,
        followerId: 1
      }).id
    },
    {
      type: 'notification-reaction',
      id: server.create('notification-reaction', {
        user: currentUser,
        reactableId: {
          type: 'post',
          id: 1
        }
      }).id
    },
    {
      type: 'notification-reply',
      id: server.create('notification-reply', {
        user: currentUser,
        commentId: 1
      }).id
    }]
  });

  server.db.users.forEach((user) => {
    if (user.id === currentUser.id) return;
    server.create('follow', {
      followerId: currentUser.id,
      followedId: user.id,
      canViewPrivate: true
    });
    server.create('follow', {
      followerId: user.id,
      followedId: currentUser.id,
      requestedPrivate: true
    });
  });

  server.create('block', {
    blockerId: 2,
    blockedId: currentUser.id
  });

  server.db.currentUsers.update(currentUser.id, { unreadNotificationsTotal: currentUser.notifications.length });

  server.db.userTagSummaries.forEach((userTagSummary) => {
    const timelineItems = server.db.timelineItems.find(server.db.users.find(server.db.userProfiles.find(userTagSummary.userProfileId).userId).timelineItemIds);

    userTagSummary.summary = timelineItems.reduce((summary, timelineItem) => {
      timelineItem.tagIds.forEach((tagId) => {
        summary.tags[tagId] = summary.tags[tagId] || [];
        summary.tags[tagId].push(timelineItem.id);
      });
      timelineItem.relationshipIds.forEach((relationshipId) => {
        summary.relationships[relationshipId] = summary.relationships[relationshipId] || [];
        summary.relationships[relationshipId].push(timelineItem.id);
      });

      return summary;
    }, { tags: {}, relationships: {} });

    userTagSummary.tagIds = A(timelineItems.reduce((tagIds, timelineItem) => {
      return tagIds.concat(timelineItem.tagIds);
    }, [])).uniq();

    userTagSummary.relationshipIds = A(timelineItems.reduce((relationshipIds, timelineItem) => {
      return relationshipIds.concat(timelineItem.relationshipIds);
    }, [])).uniq();

    server.db.userTagSummaries.update(userTagSummary.id, userTagSummary);
  });

  server.db.posts.forEach((post) => {
    post.timelineItemId = server.db.timelineItems.where((timelineItem) => timelineItem.timelineableId.id === post.id)[0].id
    server.db.posts.update(post.id, post);
  });
}
