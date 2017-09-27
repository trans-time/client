export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

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
  this.get('/posts', (schema, request) => {
    const posts = schema.posts.where({ userId: request.queryParams.userId });
    const tagIds = request.queryParams.tags.split(',').map((name) => schema.tags.where({ name }).models[0].id);

    return posts.filter((post) => {
      return tagIds.every((tagId) => post.tagIds.includes(tagId));
    });
  })
  this.get('/tags', (schema, request) => {
    return schema.tags.where({ userId: request.queryParams.userId });
  });
  this.post('/fav');
}
