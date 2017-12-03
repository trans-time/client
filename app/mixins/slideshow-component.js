import { observer } from '@ember/object';
import { not, or, equal, oneWay } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  classNameBindings: ['hidden'],
  // attributeBindings: ['style'],

  hidden: not('visible'),
  visible: or('isOutgoing', 'isIncoming'),
  isAnimating: equal('axis', 'y'),

  axis: oneWay('navState.axis'),
  progress: oneWay('navState.progress'),

  styleObserver: observer('progress', 'hidden', 'isAnimating', function () {
    this.element.style = this._generateStyle();
  }),

  _generateStyle() {
    if (this.get('hidden') || !this.get('isAnimating')) return this.get('isOutgoing') ? 'z-index: 2;' : ''; // prevent flicker as incoming and outgoing swap

    const progress = this.get('progress');

    return this.get('isOutgoing') ? this.animateOut(progress) : this.animateIn(progress);
  },

  animateIn(progress) {
    const { isOutgoing, isIncoming } = this.getProperties('isOutgoing', 'isIncoming');
    const translateAmount = isOutgoing ? progress * -100 : isIncoming ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount}%, 0, 0); z-index: 2;` : `transform: translate3d(0, ${-translateAmount}%, 0); z-index: 2;`;
  },

  animateOut(progress) {
    const { isOutgoing, isIncoming } = this.getProperties('isOutgoing', 'isIncoming');
    const translateAmount = isOutgoing ? progress * -100 : isIncoming ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const rotateAmount = translateAmount * -0.005;
    const recedeAmount = Math.abs(progress) * -1;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount * 0.5}%, 0, ${recedeAmount}px) rotate3d(0, 1, 0, ${rotateAmount}deg); z-index: 1;` : `transform: translate3d(0, ${translateAmount * -0.5}%, ${recedeAmount}px) rotate3d(1, 0, 0, ${rotateAmount}deg); z-index: 1;`;
  }
});
