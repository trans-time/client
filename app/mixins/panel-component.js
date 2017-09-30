import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['post-nav-slideshow-panel'],
  classNameBindings: ['hidden'],
  attributeBindings: ['style'],

  hidden: Ember.computed.not('visible'),
  visible: Ember.computed.or('isCurrentPanel', 'isIncomingPanel'),

  axis: Ember.computed.oneWay('navState.axis'),
  progress: Ember.computed.oneWay('navState.progress'),
  isCurrentPanel: Ember.computed.oneWay('panel.isCurrentPanel'),
  isIncomingPanel: Ember.computed.oneWay('panel.isIncomingPanel'),

  didInsertElement(...args) {
    this._super(...args);

    this.loadPanel();
  },

  loadPanel() {
    this.set('panel.isLoaded', true);
  },

  style: Ember.computed('progress', 'visible', function () {
    if (this.get('hidden')) return;

    const progress = this.get('progress');
    const easedProgress = this.easing(Math.abs(progress)) * (progress > 0 ? 1 : -1);
    const transform = this.get('isCurrentPanel') ? this.animateOut(easedProgress) : this.animateIn(easedProgress);

    return Ember.String.htmlSafe(transform);
  }),

  animateIn(progress) {
    const { isCurrentPanel, isIncomingPanel } = this.getProperties('isCurrentPanel', 'isIncomingPanel');
    const translateAmount = isCurrentPanel ? progress * -100 : isIncomingPanel ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const blurRadius = Math.abs(progress) * 10;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount}%, 0, 0); z-index: 1;` : `transform: translate3d(0, ${-translateAmount}%, 0); z-index: 1;`;
  },

  animateOut(progress) {
    const { isCurrentPanel, isIncomingPanel } = this.getProperties('isCurrentPanel', 'isIncomingPanel');
    const translateAmount = isCurrentPanel ? progress * -100 : isIncomingPanel ? progress < 0 ? Math.abs(progress * 100) - 100 : 100 - (progress * 100) : 0;
    const rotateAmount = translateAmount * -0.005;
    const recedeAmount = Math.abs(progress) * -1;

    return this.get('axis') === 'x' ? `transform: translate3d(${translateAmount * 0.5}%, 0, ${recedeAmount}px) rotate3d(0, 1, 0, ${rotateAmount}deg); z-index: -1;` : `transform: translate3d(0, ${translateAmount * -0.5}%, ${recedeAmount}px) rotate3d(1, 0, 0, ${rotateAmount}deg); z-index: -1;`;
  },

  easing(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
});
