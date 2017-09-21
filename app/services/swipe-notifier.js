import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  _swipeState: { },

  init(...args) {
    this._super(...args);

    const { body } = document;

    body.addEventListener('touchstart', Ember.run.bind(this, this._touchStart));
    body.addEventListener('touchmove', Ember.run.bind(this, this._touchMove));
    body.addEventListener('touchend', Ember.run.bind(this, this._touchEnd));

    const startEvent = Ember.run.bind(this, this._startEvent);
    const moveEvent = Ember.run.bind(this, this._moveEvent);
    const endEvent = Ember.run.bind(this, this._endEvent);
    const removeClickEvents = () => {
      body.removeEventListener('mousedown', startEvent);
      body.removeEventListener('mousemove', moveEvent);
      body.removeEventListener('mouseup', endEvent);
      body.removeEventListener('touchstart', removeClickEvents);
    };

    body.addEventListener('mousedown', startEvent);
    body.addEventListener('mousemove', moveEvent);
    body.addEventListener('mouseup', endEvent);
    body.addEventListener('touchstart', removeClickEvents);
  },

  _touchStart(e) {
    this._startEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _startEvent(e) {
    this._swipeState.diffX = 0;
    this._swipeState.diffY = 0;
    this._swipeState.startX = e.clientX;
    this._swipeState.startY = e.clientY;
    this._swipeState.currentX = e.clientX;
    this._swipeState.currentY = e.clientY;
    this._swipeState.active = true;

    this.trigger('start', this._swipeState);
  },

  _touchMove(e) {
    this._moveEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _moveEvent(e) {
    if (!this._swipeState.active) return;

    this._swipeState.diffX = this._swipeState.currentX - e.clientX;
    this._swipeState.diffY = e.clientY - this._swipeState.currentY;
    this._swipeState.currentX = e.clientX;
    this._swipeState.currentY = e.clientY;

    this.trigger('move', this._swipeState);
  },

  _touchEnd(e) {
    this._endEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _endEvent(e) {
    if (!this._swipeState.active) return;

    this._swipeState.diffX = this._swipeState.currentX - e.clientX;
    this._swipeState.diffY = e.clientY - this._swipeState.currentY;
    this._swipeState.currentX = e.clientX;
    this._swipeState.currentY = e.clientY;
    this._swipeState.active = false;

    this.trigger('end', this._swipeState);
  }
});
