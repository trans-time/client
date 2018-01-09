import Service from '@ember/service';

export default Service.extend({
  setTitleLink(name, linkRoute, linkModelId) {
    this.set('title', {
      name,
      linkRoute,
      linkModelId
    });
  },

  setTitle(name) {
    this.set('title', {
      name
    });
  }
});
