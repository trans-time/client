import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  bigotry: faker.random.boolean(),
  bot: faker.random.boolean(),
  harassment: faker.random.boolean(),
  sleaze: faker.random.boolean(),
  threat: faker.random.boolean(),
  unconsentingImage: faker.random.boolean(),
  unmarkedNSFW: faker.random.boolean(),
  text: faker.lorem.text()
});
