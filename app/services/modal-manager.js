import Ember from 'ember';

export default Ember.Service.extend({
  componentPath: '',
  resolve: null,
  reject: null,

  open(componentPath, resolve, reject) {
    this.set('componentPath', componentPath);
    if (resolve) this.set('resolve', resolve);
    if (reject) this.set('reject', reject);
  },

  close(resolveOrReject) {
    if (resolveOrReject) this.get(resolveOrReject)();

    this.setProperties({
      componentPath: '',
      resolve: null,
      reject: null
    });
  }
});
