export default function(server) {
  ['Face', 'Chest', 'Hips'].forEach((name) => {
    server.create('tag', { name });
  });
  server.create('tag', { name: 'style' })
  const symbolTag = server.create('tag', { name: 'Symbol' });
  let sequence = ['male', 'gq', 'female', 'gq'];
  for (let i = 0; i < 2; ++i) {
    sequence = sequence.concat(sequence);
  }
  const posts = server.createList('post', 1, {
    date: 0,
    tags: [symbolTag],
    panels: [],
    text: "I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! I am a text of medium length. It helps to test when the overflow button appears. Isn't that exciting! "
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
}
