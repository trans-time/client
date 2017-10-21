import Ember from 'ember';

export default Ember.Mixin.create({
  classNameBindings: ['hidden'],
  attributeBindings: ['style'],

  hidden: Ember.computed.not('visible'),
  visible: Ember.computed.or('isOutgoing', 'isIncoming'),
  isAnimating: Ember.computed.equal('axis', 'y'),

  axis: Ember.computed.oneWay('navState.axis'),
  progress: Ember.computed.oneWay('navState.progress'),

  style: Ember.computed('progress', 'visible', 'isAnimating', function () {
    if (this.get('hidden') || !this.get('isAnimating')) return;

    const progress = this.get('progress');
    const easedProgress = this.easing(Math.abs(progress)) * (progress > 0 ? 1 : -1);
    const transform = this.get('isOutgoing') ? this.animateOut(easedProgress) : this.animateIn(easedProgress);

    return Ember.String.htmlSafe(transform);
  }),

  animateIn(progress) {
    const { isOutgoing, isIncoming } = this.getProperties('isOutgoing', 'isIncoming');
    const translateAmount = isOutgoing ? progress * -100 : isIncoming ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const blurRadius = Math.abs(progress) * 10;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount}%, 0, 0); z-index: 2;` : `transform: translate3d(0, ${-translateAmount}%, 0); z-index: 2;`;
  },

  animateOut(progress) {
    const { isOutgoing, isIncoming } = this.getProperties('isOutgoing', 'isIncoming');
    const translateAmount = isOutgoing ? progress * -100 : isIncoming ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const rotateAmount = translateAmount * -0.005;
    const recedeAmount = Math.abs(progress) * -1;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount * 0.5}%, 0, ${recedeAmount}px) rotate3d(0, 1, 0, ${rotateAmount}deg); z-index: 1;` : `transform: translate3d(0, ${translateAmount * -0.5}%, ${recedeAmount}px) rotate3d(1, 0, 0, ${rotateAmount}deg); z-index: 1;`;
  },

  easing(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
});
