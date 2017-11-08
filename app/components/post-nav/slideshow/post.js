import { oneWay, or } from '@ember/object/computed';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Component.extend(SlideshowComponentMixin, {
  classNames: ['post-nav-slideshow-post'],
  classNameBindings: ['isBlank:post-nav-slideshow-post-blank'],

  isOutgoing: oneWay('post.isOutgoing'),
  isIncoming: oneWay('post.isIncoming'),
  isBlank: oneWay('post.isBlank'),
  shouldRenderPost: or('visible', 'post.shouldPrerender')
});
