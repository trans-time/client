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

  close(resolveOrReject, ...args) {
    if (resolveOrReject) this.get(resolveOrReject)(...args);

    this.setProperties({
      componentPath: '',
      resolve() {},
      reject() {}
    });
  }
});
