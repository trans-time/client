import application from 'client/utils/application';

export function initialize(appInstance) {
  application.instance = appInstance;
}

export default {
  name: 'application',
  initialize
};
