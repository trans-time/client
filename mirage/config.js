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
    return schema.users.findBy({ username: request.queryParams.username });
  });
  this.post('/users');
  // this.get('/users/:username', (schema, request) => {
  //   debugger
  //   return schema.users.where({ username: request.params.username })[0];
  // });
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
    if (isPresent(request.queryParams.followerId)) return schema.follows.where({ followerId: request.queryParams.followerId });
    else if (isPresent(request.queryParams.followedId)) return schema.follows.where({ followedId: request.queryParams.followedId });
  });
  this.post('/follows');
  this.delete('/follows/:id');
  this.patch('/follows/:id');
  this.get('/comments', (schema, request) => {
    return schema.comments.where({ postId: request.queryParams.postId });
  });
  this.post('/comments');
  this.delete('/comments/:id', (schema, request) => {
    schema.db.comments.update(request.params.id, { deleted: true });

    return schema.comments.find(request.params.id);
  });
  this.patch('/comments/:id');
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
          const fav = schema.faves.create({
            favable: post,
            userId: user.id,
            type: Math.ceil(Math.random() * 3)
          }).attrs;

          post.currentUserFavId = fav.id;
          post.totalFaves++;

          switch (fav.type) {
            case 1: post.totalStars++; break;
            case 2: post.totalSuns++; break;
            case 3: post.totalMoons++; break;
          }
        }
      })
    }

    return postsSegment;
  });
  this.delete('/posts/:id', (schema, request) => {
    schema.db.posts.update(request.params.id, { deleted: true });

    return schema.posts.find(request.params.id);
  });
  this.get('/tags', (schema, request) => {
    return schema.tags.where({ userId: request.queryParams.userId });
  });
  this.post('/faves', (schema, request) => {
    return schema.faves.create(JSON.parse(request.requestBody));
  });
  this.patch('/faves/:id', (schema, request) => {
    return schema.db.faves.update(request.params.id, JSON.parse(request.requestBody));
  });
  this.del('/faves/:id');
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
}
