import Ember from 'ember';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Ember.Component.extend(SlideshowComponentMixin, {
  classNames: ['post-nav-slideshow-post'],
  classNameBindings: ['isBlank:post-nav-slideshow-post-blank'],

  isOutgoing: Ember.computed.oneWay('post.isOutgoing'),
  isIncoming: Ember.computed.oneWay('post.isIncoming'),
  isBlank: Ember.computed.oneWay('post.isBlank'),
  shouldRenderPost: Ember.computed.or('visible', 'post.shouldPrerender')
});
