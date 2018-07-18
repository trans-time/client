import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';
import config from 'client/config/environment';
import { WebSocket } from 'phoenix';

export default Service.extend({
  messageBus: service(),
  modalManager: service(),
  phoenixSocket: service(),
  session: service(),
  store: service(),

  load() {
    const username = this.get('session.data.authenticated.username');

    if (!isEmpty(username)) {
      const store = this.get('store');

      return store.query('user', { filter: { username }, include: 'followeds,followeds.followed,blockeds,blockers,current_user' }).then((users) => {
        const user = users.get('firstObject');

        this.set('user', user);

        this.get('messageBus').publish('currentUserLoaded', user);

        this.get('modalManager').close('resolve');
        this._connectToWebsocket(user);
      });
    } else {
      return resolve();
    }
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
