import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-image'],
  classNameBindings: ['hidden'],
  attributeBindings: ['style'],

  hidden: Ember.computed.not('visible'),
  visible: Ember.computed.or('isCurrentImage', 'isIncomingImage'),

  currentImage: Ember.computed.oneWay('navState.currentImage'),
  incomingImage: Ember.computed.oneWay('navState.incomingImage'),
  axis: Ember.computed.oneWay('navState.axis'),
  progress: Ember.computed.oneWay('navState.progress'),

  isCurrentImage: Ember.computed('image', 'currentImage', {
    get() {
      return this.get('image') === this.get('currentImage');
    }
  }),

  isIncomingImage: Ember.computed('image', 'incomingImage', {
    get() {
      return this.get('image') === this.get('incomingImage');
    }
  }),

  isSettled: Ember.computed('isCurrentImage', 'progress', {
    get() {
      return this.get('isCurrentImage') && this.get('progress') === 0;
    }
  }),

  isTransitioning: Ember.computed('visible', 'progress', {
    get() {
      return this.get('visible') && this.get('progress') !== 0;
    }
  }),

  style: Ember.computed('progress', 'visible', 'backgroundImage', function () {
    const backgroundImage = this.get('backgroundImage');
    if (this.get('hidden')) return Ember.String.htmlSafe(backgroundImage);;

    const progress = this.get('progress');
    const easedProgress = this.easing(Math.abs(progress)) * (progress > 0 ? 1 : -1);
    const transform = this.get('isCurrentImage') ? this.animateOut(easedProgress) : this.animateIn(easedProgress);

    return Ember.String.htmlSafe(`${backgroundImage}${transform}`);
  }),

  animateIn(progress) {
    const { isCurrentImage, isIncomingImage } = this.getProperties('isCurrentImage', 'isIncomingImage');
    const translateAmount = isCurrentImage ? progress * -100 : isIncomingImage ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const blurRadius = Math.abs(progress) * 10;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount}%, 0, 0); z-index: 1; box-shadow: 0 0 ${blurRadius}px #333;` : `transform: translate3d(0, ${-translateAmount}%, 0); z-index: 1; box-shadow: 0 0 ${blurRadius}px #333;`;
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

  backgroundImage: Ember.computed('image.src', {
    get() {
      return `background-image: url("${Ember.Handlebars.Utils.escapeExpression(this.get('image.src'))}");`;
    }
  })
});
