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

  const runningRoutine = server.create('routine', { routineType: server.create('routine-type', { name: 'running' }) });
  const medicineRoutine = server.create('routine', { routineType: server.create('routine-type', { name: 'medicine' })});

  sequence.forEach((gender, index) => {
    const runningRoutineInstance = {
      routine: runningRoutine,
      distance: index * 10,
      frequency: 3,
      frequencyScale: 3
    }
    const medicineRoutineInstance = {
      routine: medicineRoutine,
      weight: 100,
      frequency: 2,
      frequency: 2
    }

    if (index > 0) {
      runningRoutineInstance.previousInstanceId = (index * 2) - 1;
      medicineRoutineInstance.previousInstanceId = index * 2;
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
        server.create('routine-instance', runningRoutineInstance),
        server.create('routine-instance', medicineRoutineInstance)
      ]
    }))
  });

  const currentUser = server.create('user', {
    posts
  });
  server.createList('user', 3);
}
