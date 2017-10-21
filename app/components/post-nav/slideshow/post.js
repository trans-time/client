import Ember from 'ember';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Ember.Component.extend(SlideshowComponentMixin, {
  classNames: ['post-nav-slideshow-post'],

  isOutgoing: Ember.computed.oneWay('post.isOutgoing'),
  isIncoming: Ember.computed.oneWay('post.isIncoming')
});
