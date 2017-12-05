import Service from '@ember/service';

export default Service.extend({
  componentPath: '',
  resolve() {},
  reject() {},
  options: {},

  open(componentPath, resolve, reject, options = {}) {
    this.setProperties( {
      componentPath,
      options
    });
    if (resolve) this.set('resolve', resolve);
    if (reject) this.set('reject', reject);
  },

  close(resolveOrReject) {
    if (resolveOrReject) this.get(resolveOrReject)();

    this.setProperties({
      componentPath: '',
      resolve() {},
      reject() {}
    });
  }
});
