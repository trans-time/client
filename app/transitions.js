export default function() {
  this.transition(
    this.fromRoute('users.user.index'),
    this.toRoute('users.user.timeline'),
    this.use('toLeft')
  );

  this.transition(
    this.fromRoute('users.user.timeline'),
    this.toRoute('users.user.index'),
    this.use('toRight')
  );

  this.transition(
    this.childOf('.post-nav-resize-toggle a'),
    this.use('crossFade', { duration: 750 })
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
