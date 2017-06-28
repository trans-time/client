import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(imageSet, server) {
    imageSet.images = server.createList('image', faker.random.number(4) + 1);

    imageSet.save();
  }
});
