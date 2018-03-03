import Helper from '@ember/component/helper';

export default Helper.extend({
  intl: null,

  init() {
    this._super();

    this.intl = getOwner(this).lookup('service:intl');
    this.intl.on('localeChanged', this, this.recompute);
  },

  compute(params) {
    return this.get('intl').exists(params[0])
  }
})
