import { computed } from '@ember/object';
import { notEmpty, oneWay } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['top-bar'],

  topBarManager: service(),
  router: service(),

  canSearch: oneWay('topBarManager.state.canSearch'),
  icon: oneWay('topBarManager.state.icon.name'),
  iconArgs: oneWay('topBarManager.state.icon.args'),
  linkModelId: oneWay('topBarManager.state.title.linkModelId'),
  linkRoute: oneWay('topBarManager.state.title.linkRoute'),
  title: oneWay('topBarManager.state.title.name'),

  showLink: notEmpty('linkRoute'),

  _iconAction: on(keyUp('KeyW'), function() {
    this.get('topBarManager.state.icon.action')(this.get('iconArgs'));
  }),

  _goHome() {
    this.get('router').transitionTo('application');
  },

  actions: {
    iconAction() {
      this._iconAction();
    },

    toggleMenu() {
      this.toggleProperty('menuIsOpen');
    }
  }
});
