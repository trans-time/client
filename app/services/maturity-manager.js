import Service from '@ember/service';

export default Service.extend({
  currentMaturityRating: computed({
    get() {
      return JSON.parse(sessionStorage.getItem('maturityRating')) || JSON.parse(localStorage.getItem('maturityRating')) || 0;
    }
  }),

  setMaturityRating(storage, maturityRating) {
    storage.setItem('maturityRating', maturityRating);
    this.notifyPropertyChange('currentMaturityRating');
  }
});
