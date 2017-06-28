export default function() {
  this.transition(
    this.hasClass('main-modal'),
    this.use('fade')
  );
}
