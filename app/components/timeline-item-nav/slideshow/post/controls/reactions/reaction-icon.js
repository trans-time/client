import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  tagName: 'button',
  classNames: ['timeline-item-nav-controls-element', 'reaction-icon'],
  classNameBindings: ['reacted', 'disabled'],
  attributeBindings: ['disabled', 'oncontextmenu'],

  meta: service(),
  usingTouch: alias('meta.usingTouch'),

  _activateMoonKey: on(keyUp('KeyA'), function() {
    if (this.get('isCurrentTimelineItem')) this.attrs.selectType('moon');
  }),

  _activateStarKey: on(keyUp('KeyS'), function() {
    if (this.get('isCurrentTimelineItem')) this.attrs.selectType('star');
  }),

  _activateSunKey: on(keyUp('KeyD'), function() {
    if (this.get('isCurrentTimelineItem')) this.attrs.selectType('sun');
  }),

  _activateSelf: on(keyUp('Enter'), keyUp('Space'), function() {
    if (this.element === document.activeElement) {
      this.attrs.selectType(this.get('type'));
    }
  }),

  iconType: computed('type', {
    get() {
      return `${this.get('type')}-o`;
    }
  }),

  totalReactions: computed('reactable.reactionCount', {
    get() {
      const countType = this.get('isDisplayingTypeTotal') ? this.get('type') : 'reaction';

      return this.get(`reactable.${countType}Count`);
    }
  }),

  oncontextmenu() {
    return false;
  },

  touchStart() {
    this.set('usingTouch', true);
    this.get('countdownToDisplayAllTypesTask').perform();
  },

  touchEnd() {
    this.endEvent();
  },

  mouseDown() {
    if (!this.get('usingTouch')) this.get('countdownToDisplayAllTypesTask').perform();
  },

  mouseUp() {
    if (!this.get('usingTouch')) this.endEvent();
  },

  countdownToDisplayAllTypesTask: task(function * () {
    if (this.get('shouldDisplayAllTypes')) return;

    yield timeout(200);

    this.attrs.displayAllTypes();
  }),

  endEvent() {
    this.get('countdownToDisplayAllTypesTask').cancelAll();

    if (this.get('isOpeningDisplayAllTypes')) {
      this.attrs.completeDisplayAllTypes();
    } else {
      this.attrs.selectType(this.get('type'));
    }
  }
});
