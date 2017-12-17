import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  text: faker.lorem.paragraphs,
  date: faker.date.past,
  totalStars: faker.random.number,
  totalSuns: faker.random.number,
  totalMoons: faker.random.number,
  totalFaves() {
    return this.totalStars + this.totalSuns + this.totalMoons;
  }
});
