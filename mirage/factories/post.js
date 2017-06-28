import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  text: faker.lorem.paragraph,

  afterCreate(post, server) {
    const icIds = server.db.imageCategories.map((ic) => ic.id);
    post.imageSets = [...Array(faker.random.number(3))].map(() => {
      const imageSet = server.create('image-set');
      imageSet.imageCategoryId = parseInt(icIds.splice(faker.random.number(icIds.length - 1), 1), 10);
      imageSet.save();

      return imageSet;
    });

    post.save();
  }
});
