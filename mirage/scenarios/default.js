export default function(server) {
  const bodyCategory = server.create('tag-category', { name: 'Body' });
  const miscCategory = server.create('tag-category', { name: 'Misc' });
  const unsortedCategory = server.create('tag-category', { name: 'Unsorted' });
  ['Face', 'Chest', 'Hips'].forEach((name) => {
    server.create('tag', { name, tagCategory: bodyCategory });
  });
  server.create('tag', { name: 'style', tagCategory: miscCategory })
  const symbolTag = server.create('tag', { name: 'Symbol', tagCategory: unsortedCategory });
  let sequence = ['male', 'gq', 'female', 'gq'];
  for (let i = 0; i < 2; ++i) {
    sequence = sequence.concat(sequence);
  }
  const posts = server.createList('post', 1, {
    date: 0,
    tags: [symbolTag],
    panels: []
  });

  const bikingRoutine = server.create('routine', { routineType: server.create('routine-type-exercise', { name: 'biking', icon: 'bicycle', color: 'orange' }) });
  const medicineRoutine = server.create('routine', { routineType: server.create('routine-type-medicine', { name: 'medicine', color: 'red' })});

  sequence.forEach((gender, index) => {
    const bikingRoutineInstance = {
      routine: bikingRoutine,
      distance: Math.random() < 0.5 ? ((1609340 * index) + 1) * 1.25 : undefined,
      duration: Math.random() < 0.5 ? Math.floor((Math.random() * index) * 10000000) : undefined,
      frequency: (index % 5) + 1,
      frequencyScale: (index % 3)
    }
    const medicineRoutineInstance = {
      routine: medicineRoutine,
      volume: Math.random() < 0.5 ? Math.floor((Math.random() * index) * 100) : undefined,
      weight: Math.random() < 0.5 ? Math.floor((Math.random() * index) * 100) : undefined,
      frequency: 2,
      frequencyScale: 2
    }

    if (index > 0) {
      bikingRoutineInstance.previousInstanceId = { type: 'routine-instance-exercises', id: index };
      medicineRoutineInstance.previousInstanceId = { type: 'routine-instance-medicines', id: index };
    }
    posts.push(server.create('post', {
      date: index * 1000000000,
      tags: [symbolTag],
      panels: [0, 45, 90, 135, 180, 225, 270, 315].map((orientation) => {
        return server.create('image', {
          src: `/dev/${gender}-${orientation}.png`
        })
      }),
      routineInstances: [
        server.create('routine-instance-exercise', bikingRoutineInstance),
        server.create('routine-instance-medicine', medicineRoutineInstance)
      ]
    }))
  });

  const currentUser = server.create('user', {
    posts
  });
  server.createList('user', 3);
}
