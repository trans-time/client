import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  src: faker.image.people
});
