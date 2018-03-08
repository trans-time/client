import { isPresent } from '@ember/utils';
import moment from 'moment';

export default function validateDateSequence(options) {
  return (key, newValue, oldValue, changes, content) => {
    
    if (isPresent(options.before)) {
      const start = content.get(key);
      const end = content.get(options.before);

      if (!start || !end || moment(newValue || content.get(key)).isBefore(content.get(options.before))) return true;
      else return 'errors.validations.dateSequenceBefore';
    }
  }
}
