import Service from '@ember/service';

export default Service.extend({
  componentPath: '',
  resolve() {},
  reject() {},

  open(componentPath, resolve, reject) {
    this.set('componentPath', componentPath);
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
