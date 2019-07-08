import Component from '@ember/component';

export default Component.extend({
  tag: '',

  actions: {
    handleSubmit() {
      this.submit(this.get('changeset'));
    }
  }
});
