import Component from '@ember/component';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import EmberObject, { computed, observer } from '@ember/object';
import { alias, oneWay, equal, sort } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';

const PanelDecorator = EmberObject.extend({
  isLoaded: alias('model.srcIsLoaded'),
  shouldLoad: alias('model.srcShouldLoad'),
  loadPromise: alias('model.loadPromise'),

  postNavComponent: oneWay('model.postNavComponent'),
  src: oneWay('model.src'),

  getNeighbor(direction) {
    return this.get(direction) || this.resetNeighbor(direction);
  },

  resetNeighbor(direction) {
    const index = this.get('index');
    switch(direction) {
      case 'right': return this.set(direction, this._getHorizontalNeighbor(index + 1, 'firstObject'));
      case 'left': return this.set(direction, this._getHorizontalNeighbor(index - 1, 'lastObject'));
      default: {
        const post = this.get('post').getNeighbor(direction);

        if (isBlank(post)) return 'edge';

        const panels = post.get('panels');

        return this.set(direction, panels[index] || panels.get('firstObject'));
      }
    }
  },

  _getHorizontalNeighbor(index, wrapIndex) {
    const post = this.get('post');

    return post.get('panels.length') === 1 ? 'edge' : post.get('panels')[index] || post.get(`panels.${wrapIndex}`);
  }
});

const PostDecorator = EmberObject.extend({
  posts: oneWay('component.decoratedPosts'),
  isBlank: equal('model.panels.length', 0),

  isIncoming: computed('panels.@each.isIncoming', {
    get() {
      return this.get('panels').any((panel) => panel.get('isIncoming'));
    }
  }),

  isOutgoing: computed('panels.@each.isOutgoing', {
    get() {
      return this.get('panels').any((panel) => panel.get('isOutgoing'));
    }
  }),

  panels: computed('model.panels.[]', {
    get() {
      let panels = this.get('model.panels');

      if (panels.get('length') === 0) panels = [this.get('_blankPanel')];

      return panels.toArray().map((model, index) => {
        return PanelDecorator.create({
          model,
          index,
          post: this
        })
      });
    }
  }),

  getNeighbor(direction) {
    return this.get(direction) || this.resetNeighbor(direction);
  },

  resetNeighbor(direction) {
    const index = this.get('posts').indexOf(this);

    switch(direction) {
      case 'up': return this.set(direction, this.get('posts')[index - 1]);
      case 'down': return this.set(direction, this.get('posts')[index + 1]);
    }
  },

  _blankPanel: computed({
    get() {
      return EmberObject.create({ postNavComponent: 'post-nav/slideshow/post/blank', post: { content: this.get('model') } });
    }
  })
});

export default Component.extend({
  classNames: ['post-nav'],
  classNameBindings: ['chatIsOpen'],

  nextPostIndex: 0,

  messageBus: service(),
  topBarManager: service(),

  decoratedPosts: computed(() => A()),

  posts: computed('post', {
    get() {
      return A([this.get('post')])
    }
  }),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('closeComments', this, this._toggleComments);
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    if (this.get('commentsAreOpen')) {
      this.set('chatIsOpen', true);
      next(() => this.get('topBarManager').showCloseComments());
    } else {
      this.set('chatIsOpen', false);
      if (this.get('topBarManager.state.showingCloseComments')) next(() => this.get('topBarManager').restorePreviousState());
    }
  },

  addToDecoratedPosts: on('init', observer('posts.[]', function() {
    const { decoratedPosts, posts, nextPostIndex } = this.getProperties('decoratedPosts', 'posts', 'nextPostIndex');
    if (decoratedPosts.get('length') > posts.get('length')) {
      return;
    }
    const newPosts = posts.slice(nextPostIndex).map((model, index) => {
      return PostDecorator.create({
        model,
        component: this
      });
    });

    decoratedPosts.get('lastObject.model.date') < newPosts[0].get('model.date') ? decoratedPosts.pushObjects(newPosts) : decoratedPosts.unshiftObjects(newPosts);

    this.set('nextPostIndex', posts.get('length'));
  })),

  _toggleComments() {
    this.toggleProperty('chatIsOpen');

    if (this.get('chatIsOpen')) {
      this.attrs.openComments();
    } else {
      this.attrs.closeComments();
    }
  },

  actions: {
    changePost(post) {
      this.set('post', post);
      this.attrs.changePost(post);
    },

    loadMorePosts(...args) {
      this.sendAction('action', ...args);
    },

    removePost(post) {
      const upNeighbor = post.getNeighbor('up');
      const downNeighbor = post.getNeighbor('down');
      this.get('decoratedPosts').removeObject(post);

      if (isPresent(upNeighbor) && upNeighbor !== 'edge') {
        upNeighbor.resetNeighbor('down');
        upNeighbor.get('panels').forEach((panel) => panel.resetNeighbor('down'));
      }
      if (isPresent(downNeighbor) && downNeighbor !== 'edge') {
        downNeighbor.resetNeighbor('up');
        downNeighbor.get('panels').forEach((panel) => panel.resetNeighbor('up'));
      }

      this.decrementProperty('nextPostIndex');
    },

    toggleChat() {
      this._toggleComments();
    }
  }
});
