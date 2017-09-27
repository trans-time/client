export default function(server) {
  ['Face', 'Chest', 'Hips', 'Style'].forEach((name) => {
    server.create('tag', { name });
  });
  const symbolTag = server.create('tag', { name: 'Symbol' });
  const posts = ['male', 'gq', 'female'].map((gender, index) => {
    return server.create('post', {
      date: index * 1000000000,
      tags: [symbolTag],
      images: [0, 45, 90, 135, 180, 225, 270, 315].map((orientation) => {
        return server.create('image', {
          src: `/dev/${gender}-${orientation}.png`
        })
      })
    })
  });
  const currentUser = server.create('user', {
    posts
  });
  server.createList('user', 3);

  posts.forEach((post) => {
    post.faves = server.createList('fav', 1, { post, user: currentUser })
    post.save();
  })
}
