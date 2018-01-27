import { isPresent } from '@ember/utils';
import { upload } from 'ember-file-upload/mirage';

export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 1000;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  this.post('/auth', () => {
    return {
      user: {
        token: 'foo',
        username: 'celeste'
      }
    }
  });

  this.get('/users', (schema, request) => {
    if (request.queryParams.perPage) {
      return schema.users.all().filter((user) => user.username.includes(request.queryParams.username)).slice(0, request.queryParams.perPage);
    } else {
      return schema.users.findBy({ username: request.queryParams.username });
    }
  });
  this.post('/users');
  this.post('/password-changes');
  this.post('/email-changes');
  this.get('/user-profiles/:id', (schema, request) => {
    return schema.users.find(request.params.id).userProfile;
  });
  this.patch('/user-profiles/:id');
  this.get('/current-users/:id', (schema, request) => {
    return schema.users.find(request.params.id).currentUser;
  });
  this.get('/follows', (schema, request) => {
    const query = request.queryParams.followerId ? { followerId: request.queryParams.followerId } : { followedId: request.queryParams.followedId };
    const follows = schema.follows.where(query);
    const startingIndex = (request.queryParams.page - 1) * request.queryParams.per_page;
    follows.models = follows.models.slice(startingIndex, startingIndex + parseInt(request.queryParams.per_page, 10));
    const json = this.serializerOrRegistry.serialize(follows);

    json.meta = {
      total_pages: 0
    };
    return json;
  });
  this.post('/follows');
  this.delete('/follows/:id');
  this.patch('/follows/:id');
  this.post('/blocks');
  this.delete('/blocks/:id');
  this.get('/comments', (schema, request) => {
    return schema.comments.where({ postId: request.queryParams.postId });
  });
  this.post('/comments');
  this.get('/comments/:id');
  this.delete('/comments/:id', (schema, request) => {
    schema.db.comments.update(request.params.id, { deleted: true });

    return schema.comments.find(request.params.id);
  });
  this.patch('/comments/:id');
  this.get('/timeline-items');
  this.get('/posts', (schema, request) => {
    let posts = request.queryParams.userId ? schema.posts.where({ userId: request.queryParams.userId }) : schema.posts.all();
    if (request.queryParams.lastPost) posts.models = posts.models.reverse();
    if (request.queryParams.refreshPostIds) {
      const refreshPostIds = request.queryParams.refreshPostIds.split(',');
      return posts.filter((post) => refreshPostIds.includes(post.id));
    }
    const queryTagIds = request.queryParams.query ? schema.tags.where({ name: request.queryParams.query }).models.map((tag) => tag.id) : null;
    const queryOrTags = request.queryParams.tags || queryTagIds;
    if (isPresent(queryOrTags)) {
      posts = posts.filter((post) => {
        return queryOrTags.every((tagId) => post.tagIds.includes(tagId));
      });
    }

    const perPage = parseInt(request.queryParams.perPage, 10);
    const shouldProgress = request.queryParams.shouldProgress === 'true';
    const isInitial = request.queryParams.shouldProgress === undefined;
    let initialPostIndex = 0;

    if (request.queryParams.fromPostId) {
      initialPostIndex = posts.models.indexOf(posts.models.find((post) => post.id === request.queryParams.fromPostId)) || 0;
    }

    const startingIndex = Math.max(0, isInitial ? initialPostIndex - 5 : shouldProgress ? initialPostIndex - perPage : initialPostIndex + 1);
    const endingIndex = Math.min(posts.length - 1, isInitial ? initialPostIndex + 5 : shouldProgress ? initialPostIndex : initialPostIndex + perPage + 1);
    const postsSegment = posts.slice(startingIndex, endingIndex + 1);

    if (isPresent(request.requestHeaders.Authorization)) {
      const user = schema.users.findBy({ username: request.requestHeaders.Authorization.match(/username="(.*)"/)[1] });
      postsSegment.models.forEach((post) => {
        if (Math.random() > 0.4) {
          const reaction = schema.reactions.create({
            reactableId: { type: 'post', id: post.id },
            userId: user.id,
            type: Math.ceil(Math.random() * 3)
          }).attrs;

          post.currentUserReactionId = reaction.id;
        }
      })
    }

    return postsSegment;
  });
  this.get('/posts/:id');
  this.delete('/timeline-items/:id', (schema, request) => {
    schema.db.timelineItems.update(request.params.id, { deleted: true });

    return schema.timelineItems.find(request.params.id);
  });
  this.get('/tags', (schema, request) => {
    return schema.tags.all().filter((tag) => tag.name.includes(request.queryParams.name)).slice(0, request.queryParams.perPage);
  });
  this.get('/reactions', (schema, request) => {
    const reactions = schema.reactions.where({ reactableId: { id: request.queryParams.reactableId, type: request.queryParams.reactableType } });
    const startingIndex = (request.queryParams.page - 1) * request.queryParams.per_page;
    reactions.models = reactions.models.slice(startingIndex, startingIndex + parseInt(request.queryParams.per_page, 10));
    const json = this.serializerOrRegistry.serialize(reactions);

    json.meta = {
      total_pages: Math.ceil(schema.reactions.all().length / request.queryParams.per_page)
    };
    return json;
  })
  this.post('/reactions', (schema, request) => {
    return schema.reactions.create(JSON.parse(request.requestBody));
  });
  this.patch('/reactions/:id', (schema, request) => {
    return schema.db.reactions.update(request.params.id, JSON.parse(request.requestBody));
  });
  this.del('/reactions/:id');
  this.get('/flags');
  this.get('/flags/:id');
  this.post('/flags', (schema, request) => {
    return schema.flags.create(JSON.parse(request.requestBody));
  });
  this.get('/posts/:id');
  this.patch('/posts/:id', (schema, request) => {
    return schema.db.posts.update(request.params.id, JSON.parse(request.requestBody));
  });
  this.post('/posts');
  this.post('/images');
  this.post('/images/upload', upload((db, request) => {
    let { name: filename, size: filesize, url: src } = request.requestBody.file;
    let photo = db.create('image', { filename, filesize, src, uploadedAt: new Date() });
    return photo;
  }));
  this.get('/notifications', (schema, request) => {
    const json = { data: schema.users.find(request.queryParams.userId).notifications.models.map((model) => this.serializerOrRegistry.serialize(model).data) };
    return json;
  });
  this.get('/search-queries', (schema, request) => {
    const query = request.queryParams.query;

    return schema.searchQueries.create({
      identityIds: schema.db.identities.filter((identity) => identity.name.includes(query)).slice(0, 5).map((identity) => identity.id),
      tagIds: schema.db.tags.filter((tag) => tag.name.includes(query)).slice(0, 5).map((tag) => tag.id),
      userIds: schema.db.users.filter((user) => user.username.includes(query)).slice(0, 5).map((user) => user.id)
    });
  })
  this.post('/user-profiles/upload', upload((db, request) => {
    return request.requestBody.file.src;
  }));
  this.post('/user-identities', (schema, request) => {
    const body = JSON.parse(request.requestBody);
    const name = body.data.attributes.name;
    const identity = schema.identities.where({ name }).models[0] || schema.identities.create({ name });

    body.data.relationships.identity = { data: { type: 'identity', id: identity.id }};

    return schema.userIdentities.create(body);
  });
  this.patch('/user-identities/:id', (schema, request) => {
    const id = request.params.id;
    const body = JSON.parse(request.requestBody);
    const name = body.data.attributes.name;
    const identity = schema.identities.where({ name }).models[0] || schema.identities.create({ name });

    body.data.relationships.identity = { data: { type: 'identity', id: identity.id }};

    return schema.db.userIdentities.update(id, body);
  });
  this.get('/moderation-reports');
  this.get('/moderation-reports/:id');
  this.patch('/moderation-reports/:id', (schema, request) => {
    return schema.db.moderationReports.update(request.params.id, JSON.parse(request.requestBody));
  });
  this.get('/moderation-warnings');
  this.get('/moderation-warnings/:id');
}
