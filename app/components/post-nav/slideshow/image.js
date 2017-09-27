import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'img',
  classNames: ['post-nav-slideshow-image'],
  classNameBindings: ['hidden'],
  attributeBindings: ['style', 'src'],

  hidden: Ember.computed.not('visible'),
  visible: Ember.computed.or('isCurrentImage', 'isIncomingImage'),

  axis: Ember.computed.oneWay('navState.axis'),
  progress: Ember.computed.oneWay('navState.progress'),
  isCurrentImage: Ember.computed.oneWay('image.isCurrentImage'),
  isIncomingImage: Ember.computed.oneWay('image.isIncomingImage'),

  didInsertElement(...args) {
    this._super(...args);

    this.set('image.loadPromise', new Ember.RSVP.Promise((resolve) => {
      this.element.onload = resolve;
    })).then(() => this.set('image.isLoaded', true));
  },

  style: Ember.computed('progress', 'visible', function () {
    if (this.get('hidden')) return;

    const progress = this.get('progress');
    const easedProgress = this.easing(Math.abs(progress)) * (progress > 0 ? 1 : -1);
    const transform = this.get('isCurrentImage') ? this.animateOut(easedProgress) : this.animateIn(easedProgress);

    return Ember.String.htmlSafe(transform);
  }),

  animateIn(progress) {
    const { isCurrentImage, isIncomingImage } = this.getProperties('isCurrentImage', 'isIncomingImage');
    const translateAmount = isCurrentImage ? progress * -100 : isIncomingImage ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const blurRadius = Math.abs(progress) * 10;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount}%, 0, 0); z-index: 1;` : `transform: translate3d(0, ${-translateAmount}%, 0); z-index: 1;`;
  },

  animateOut(progress) {
    const { isCurrentImage, isIncomingImage } = this.getProperties('isCurrentImage', 'isIncomingImage');
    const translateAmount = isCurrentImage ? progress * -100 : isIncomingImage ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const rotateAmount = translateAmount * -0.005;
    const recedeAmount = Math.abs(progress) * -1;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount * 0.5}%, 0, ${recedeAmount}px) rotate3d(0, 1, 0, ${rotateAmount}deg); z-index: -1;` : `transform: translate3d(0, ${translateAmount * -0.5}%, ${recedeAmount}px) rotate3d(1, 0, 0, ${rotateAmount}deg); z-index: -1;`;
  },

  easing(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  src: Ember.computed('image.src', 'image.shouldLoad', {
    get() {
      if (this.get('image.shouldLoad')) return this.get('image.src');
    }
  })
});
