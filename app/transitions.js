export default function() {
  this.transition(
    this.fromRoute('users.user.profile'),
    this.toRoute('users.user.timeline'),
    this.use('toLeft')
  );

  this.transition(
    this.fromRoute('users.user.timeline'),
    this.toRoute('users.user.profile'),
    this.use('toRight')
  );

  this.transition(
    this.childOf('.post-nav-resize-toggle a'),
    this.use('crossFade', { duration: 750 })
  );

  this.transition(
    this.hasClass('cross-fade'),
    this.use('crossFade')
  );

  this.transition(
    this.hasClass('main-modal'),
    this.use('fade')
  );

  this.transition(
    this.hasClass('top-bar-menu-modal'),
    this.toValue((toValue, fromValue) => fromValue === null),
    this.use('to-down')
  );

  this.transition(
    this.hasClass('top-bar-menu-modal'),
    this.toValue((toValue) => toValue === null),
    this.use('to-up')
  );
}
