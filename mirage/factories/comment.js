import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  deleted: false,
  text: faker.lorem.paragraphs,

  afterCreate(comment) {
    comment.date = faker.date.past().getTime();

    comment.save();
  }
});
