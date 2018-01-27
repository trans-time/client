import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  deleted: false,
  text: faker.lorem.paragraphs,
  totalMoons: faker.random.number,
  totalStars: faker.random.number,
  totalSuns: faker.random.number,

  afterCreate(comment) {
    comment.date = faker.date.past().getTime();

    comment.save();
  }
});
