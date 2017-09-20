export default function(server) {
  ['Face', 'Chest', 'Hips', 'Style'].forEach((name) => {
    server.create('tag', { name });
  });
  server.createList('user', 3);
}
