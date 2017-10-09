import Ember from 'ember';
import durationTransform from 'client/utils/duration';
import lengthTransform from 'client/utils/length';
import volumeTransform from 'client/utils/volume';
import weightTransform from 'client/utils/weight';

export default Ember.Component.extend({
  currentUser: Ember.inject.service(),
  intl: Ember.inject.service(),

  previousInstanceRelationship: Ember.computed.oneWay('routineInstance.previousInstance'),
  routine: Ember.computed.oneWay('routineInstance.routine'),
  routineType: Ember.computed.oneWay('routine.routineType'),

  category: Ember.computed.oneWay('routineType.category'),
  name: Ember.computed.oneWay('routineType.name'),
  icon: Ember.computed.oneWay('routineType.icon'),

  previousInstance: Ember.computed({
    get() {
      return this.get('previousInstanceRelationship.content') || Ember.Object.create();
    }
  }),

  text: Ember.computed({
    get() {
      const configuration = this.get('currentUser.configuration');
      const { category, frequency, intl } = this.getProperties('category', 'frequency', 'intl');
      const attributes = ['distance', 'duration', 'reps', 'sets', 'weightInMicrograms', 'volume'];
      const { previousInstance, routineInstance } = this.getProperties('previousInstance', 'routineInstance');
      const currentAttributes = routineInstance.getProperties(...attributes);
      const previousAttributes = previousInstance.getProperties(...attributes);
      const stringParts = [];

      const preferedUnitSystem = configuration.get('unitSystem') || 'metric';

      if (Ember.isPresent(currentAttributes.volume) || Ember.isPresent(previousAttributes.volume)) {
        stringParts.push(volumeTransform(currentAttributes.volume, category === 'medicine' ? 'metric' : configuration.get('unitSystemVolume') || preferedUnitSystem, intl, previousAttributes.volume));
      }

      if (Ember.isPresent(currentAttributes.weightInMicrograms) || Ember.isPresent(previousAttributes.weightInMicrograms)) {
        stringParts.push(weightTransform(currentAttributes.weightInMicrograms, category === 'medicine' ? 'metric' : configuration.get('unitSystemWeight') || preferedUnitSystem, intl, previousAttributes.weightInMicrograms));
      }

      if (Ember.isPresent(currentAttributes.distance) || Ember.isPresent(previousAttributes.distance)) {
        stringParts.push(lengthTransform(currentAttributes.distance, configuration.get('unitSystemLength') || preferedUnitSystem, intl, previousAttributes.distance));
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
