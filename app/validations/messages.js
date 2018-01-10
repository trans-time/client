import defaultMessages from 'ember-changeset-validations/utils/messages';
import application from 'client/utils/application';

const { keys } = Object;
const intl = application.instance.lookup('service:intl');

let messages = {};
keys(defaultMessages).forEach((key) => {
  let lookupKey = `errors.validations.${key}`;
  if (intl.exists(lookupKey)) {
    messages[key] = intl.t(lookupKey).toString();
  } else {
    messages[key] = defaultMessages[key];
  }
});

export default messages;
