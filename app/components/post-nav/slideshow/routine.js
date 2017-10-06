import Ember from 'ember';
import durationTransform from 'client/utils/duration';
import lengthTransform from 'client/utils/length';
import weightTransform from 'client/utils/weight';

export default Ember.Component.extend({
  intl: Ember.inject.service(),

  previousInstanceRelationship: Ember.computed.oneWay('routineInstance.previousInstance'),
  routine: Ember.computed.oneWay('routineInstance.routine'),
  routineType: Ember.computed.oneWay('routine.routineType'),

  name: Ember.computed.oneWay('routineType.name'),
  icon: Ember.computed.oneWay('routineType.icon'),

  previousInstance: Ember.computed({
    get() {
      return this.get('previousInstanceRelationship.content') || Ember.Object.create();
    }
  }),

  text: Ember.computed({
    get() {
      const intl = this.get('intl');
      const frequency = this.get('frequency');
      const attributes = ['distance', 'duration', 'reps', 'sets', 'weightInMicrograms'];
      const { previousInstance, routineInstance } = this.getProperties('previousInstance', 'routineInstance');
      const currentAttributes = routineInstance.getProperties(...attributes);
      const previousAttributes = previousInstance.getProperties(...attributes);
      const stringParts = [];

      if (Ember.isPresent(currentAttributes.weightInMicrograms) || Ember.isPresent(previousAttributes.weightInMicrograms)) {
        stringParts.push(weightTransform(currentAttributes.weightInMicrograms, 'english', intl, previousAttributes.weightInMicrograms));
      }

      if (Ember.isPresent(currentAttributes.distance) || Ember.isPresent(previousAttributes.distance)) {
        stringParts.push(lengthTransform(currentAttributes.distance, 'english', intl, previousAttributes.distance));
      }

      if (Ember.isPresent(currentAttributes.duration) || Ember.isPresent(previousAttributes.duration)) {
        stringParts.push(durationTransform(currentAttributes.duration, intl, previousAttributes.duration));
      }

      return Ember.String.htmlSafe(stringParts.length > 0 ? `${stringParts.join(' ')}, ${frequency}` : frequency);
    }
  }),

  frequency: Ember.computed({
    get() {
      const { previousInstance, routineInstance } = this.getProperties('previousInstance', 'routineInstance');
      const { frequency, frequencyScale } = routineInstance.getProperties('frequency', 'frequencyScale');
      const { frequency: previousFrequency, frequencyScale: previousFrequencyScale } = previousInstance.getProperties('frequency', 'frequencyScale');

      return this._translateFrequency(frequency, frequencyScale);
    }
  }),

  _translateFrequency(frequency, scale) {
    if (Ember.isBlank(frequency) || Ember.isBlank(scale)) return '';

    const intl = this.get('intl');

    return intl.t(`routine.frequencyScale.${scale}`, { frequency: intl.t('routine.frequency', { frequency }) });
  }
});
