import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  date: faker.date.past,
  deleted: false,
  text: faker.lorem.paragraphs,
  totalMoons: faker.random.number,
  totalStars: faker.random.number,
  totalSuns: faker.random.number
});
