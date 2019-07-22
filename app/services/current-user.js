import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { resolve } from 'rsvp';
import config from 'client/config/environment';
import { WebSocket } from 'phoenix';

export default Service.extend({
  messageBus: service(),
  phoenixSocket: service(),
  session: service(),
  store: service(),

  currentUserId: computed('user.id', {
    get() {
      return this.get('user.id') || 'anon';
    }
  }),

  load() {
    const username = this.get('session.data.authenticated.username');

    if (!isEmpty(username)) {
      const store = this.get('store');

      return store.query('user', { filter: { username }, include: 'followeds,followeds.followed,blockeds,blockers,current_user' }).then((users) => {
        const user = users.get('firstObject');

        this.setupStorage(user.id);
        this.set('user', user);

        this.get('messageBus').publish('currentUserLoaded', user);

        this._connectToWebsocket(user);
      });
    } else {
      return resolve();
    }
  },

  setupStorage(id) {
    const storageId = `user-${id}`;
    if (!sessionStorage.getItem(storageId) || !JSON.parse(sessionStorage.getItem(storageId)).blacklistedTagIds) sessionStorage.setItem(storageId, JSON.stringify({ blacklistedTagIds: [], approvedTimelineItemIds: [] }));
    if (!localStorage.getItem(storageId) || !JSON.parse(localStorage.getItem(storageId)).blacklistedTagIds) localStorage.setItem(storageId, JSON.stringify({ blacklistedTagIds: [], approvedTimelineItemIds: [] }));
  },

  getStorage(storage) {
    const storageId = `user-${this.get('currentUserId')}`;
    return JSON.parse(storage.getItem(storageId));
  },

  setStorage(storage, value) {
    const storageId = `user-${this.get('currentUserId')}`;
    storage.setItem(storageId, JSON.stringify(value));
  },

  _connectToWebsocket(user) {
    const socket = this.get('phoenixSocket');

    socket.on('open', () => {
      const channel = socket.joinChannel(`user:${user.id}`, {});

      channel.on('new_notification', (message) => user.set('currentUser.unseenNotificationCount', message.unseen_notification_count));
    });

    socket.connect(`${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${config.hostname}/socket`, {
      transport: WebSocket,
      params: {
        token: JSON.parse(localStorage.getItem('ember_simple_auth-session')).authenticated.token
      }
    });
  }
});
