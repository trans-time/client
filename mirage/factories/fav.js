import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  type: faker.list.random(['star', 'sun', 'moon'])
});
