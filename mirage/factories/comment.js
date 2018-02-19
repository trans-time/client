import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  date: faker.date.past,
  deleted: false,
  text: faker.lorem.paragraphs,
  moonCount: faker.random.number,
  starCount: faker.random.number,
  sunCount: faker.random.number
});
