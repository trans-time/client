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

  this.post('/auth', (schema, request) => {
    return {
      user: {
        token: 'foo',
        id: 1
      }
    }
  });

  this.get('/users');
  this.post('/users');
  this.get('/users/:id');
  this.get('/user-tag-summaries/:id', (schema, request) => {
    return schema.users.find(request.params.id).userTagSummary;
  });
  this.get('/posts', (schema, request) => {
    let posts = schema.posts.where({ userId: request.queryParams.userId });
    if (Ember.isPresent(request.queryParams.tags)) {
      posts = posts.filter((post) => {
        return request.queryParams.tags.every((tagId) => post.tagIds.includes(tagId));
      });
    }
    const page = parseInt(request.queryParams.page, 10);
    const perPage = parseInt(request.queryParams.perPage, 10);
    const startingIndex = page * perPage || 0;
    const postsSegment = posts.slice(startingIndex, startingIndex + perPage);

    if (Ember.isPresent(request.requestHeaders.Authorization)) {
      const user = schema.db.users.find(request.requestHeaders.Authorization.match(/id="(.*)"/)[1]);
      postsSegment.models.forEach((post) => {
        if (Math.random() > 0.4) {
          const fav = schema.faves.create({
            postId: post.id,
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

    if (request.queryParams.direction === 'desc') postsSegment.models.reverse();

    return postsSegment;
  })
  this.get('/tags', (schema, request) => {
    return schema.tags.where({ userId: request.queryParams.userId });
  });
  this.post('/faves');
  this.patch('/faves/:id')
  this.del('/faves/:id');
}
