export default function() {
  this.transition(
    this.hasClass('main-modal'),
    this.use('fade')
  );

  this.transition(
    this.childOf('.timeline-post'),
    this.use('crossFade', { duration: 150 })
  );
}
