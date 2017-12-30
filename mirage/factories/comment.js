import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  deleted: false,
  text: faker.lorem.paragraphs,
  totalStars: faker.random.number,
  totalSuns: faker.random.number,
  totalMoons: faker.random.number,
  totalFaves() {
    return this.totalStars + this.totalSuns + this.totalMoons;
  },

  afterCreate(comment) {
    comment.date = faker.date.past().getTime();

    comment.save();
  }
});
