import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  type: faker.list.random(1, 2, 3)
});
