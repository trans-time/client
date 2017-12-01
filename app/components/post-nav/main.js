import { on } from '@ember/object/evented';
import { A } from '@ember/array';
import Component from '@ember/component';
import { isBlank } from '@ember/utils';
import { alias, oneWay, equal } from '@ember/object/computed';
import EmberObject, { computed, observer } from '@ember/object';

const PanelDecorator = EmberObject.extend({
  isLoaded: alias('model.srcIsLoaded'),
  shouldLoad: alias('model.srcShouldLoad'),
  loadPromise: alias('model.loadPromise'),

  postNavComponent: oneWay('model.postNavComponent'),
  src: oneWay('model.src'),

  getNeighbor(direction) {
    return this.get(direction) || this._getNeighbor(direction);
  },

  _getNeighbor(direction) {
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
    return this.get(direction) || this._getNeighbor(direction);
  },

  _getNeighbor(direction) {
    const index = this.get('index');

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
  tagName: '',

  nextPostIndex: 0,

  decoratedPosts: computed(() => A()),

  addToDecoratedPosts: on('init', observer('posts.[]', function() {
    const { decoratedPosts, posts, nextPostIndex } = this.getProperties('decoratedPosts', 'posts', 'nextPostIndex');
    const newPosts = posts.slice(nextPostIndex).map((model, index) => {
      return PostDecorator.create({
        model,
        index: index + nextPostIndex,
        component: this
      });
    });

    decoratedPosts.pushObjects(newPosts);

    this.set('nextPostIndex', posts.get('length'));
  })),

  actions: {
    changePost(post) {
      this.set('post', post);
    },

    loadMorePosts(resolve, reject) {
      this.sendAction('action', resolve, reject)
    }
  }
});
