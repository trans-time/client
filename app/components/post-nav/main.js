import Ember from 'ember';

const PanelDecorator = Ember.Object.extend({
  isLoaded: Ember.computed.alias('model.srcIsLoaded'),
  shouldLoad: Ember.computed.alias('model.srcShouldLoad'),
  loadPromise: Ember.computed.alias('model.loadPromise'),

  postNavComponent: Ember.computed.oneWay('model.postNavComponent'),
  src: Ember.computed.oneWay('model.src'),

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

        if (Ember.isBlank(post)) return 'edge';

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

const PostDecorator = Ember.Object.extend({
  posts: Ember.computed.oneWay('component.decoratedPosts'),
  isBlank: Ember.computed.equal('model.panels.length', 0),

  isIncoming: Ember.computed('panels.@each.isIncoming', {
    get() {
      return this.get('panels').any((panel) => panel.get('isIncoming'));
    }
  }),

  isOutgoing: Ember.computed('panels.@each.isOutgoing', {
    get() {
      return this.get('panels').any((panel) => panel.get('isOutgoing'));
    }
  }),

  panels: Ember.computed('model.panels.[]', {
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

  _blankPanel: Ember.computed({
    get() {
      return Ember.Object.create({ postNavComponent: 'post-nav/slideshow/blank', post: { content: this.get('model') } });
    }
  })
});

export default Ember.Component.extend({
  tagName: '',

  nextPostIndex: 0,

  decoratedPosts: Ember.computed(() => Ember.A()),

  addToDecoratedPosts: Ember.on('init', Ember.observer('posts.[]', function() {
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
