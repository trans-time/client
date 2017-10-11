import Ember from 'ember';
import durationTransform from 'client/utils/duration';
import lengthTransform from 'client/utils/length';
import quantityTransform from 'client/utils/quantity';
import volumeTransform from 'client/utils/volume';
import weightTransform from 'client/utils/weight';

export default Ember.Component.extend({
  classNames: ['post-nav-slideshow-quantifiable'],
  classNameBindings: ['colorScheme'],

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

  colorScheme: Ember.computed({
    get() {
      return `quantifiable-${this.get('routineType.color')}`;
    }
  }),

  text: Ember.computed({
    get() {
      const configuration = this.get('currentUser.configuration');
      const { category, frequency, intl } = this.getProperties('category', 'frequency', 'intl');
      const attributes = ['distance', 'duration', 'laps', 'reps', 'sets', 'weightInMicrograms', 'volume'];
      const { previousInstance, routineInstance } = this.getProperties('previousInstance', 'routineInstance');
      const currentAttributes = routineInstance.getProperties(...attributes);
      const previousAttributes = previousInstance.getProperties(...attributes);
      const stringParts = [];

      const preferedUnitSystem = configuration.get('unitSystem') || 'metric';

      if (currentAttributes.volume || previousAttributes.volume) {
        stringParts.push(volumeTransform(currentAttributes.volume, category === 'medicine' ? 'metric' : configuration.get('unitSystemVolume') || preferedUnitSystem, intl, previousAttributes.volume));
      }

      if (currentAttributes.weightInMicrograms || previousAttributes.weightInMicrograms) {
        stringParts.push(weightTransform(currentAttributes.weightInMicrograms, category === 'medicine' ? 'metric' : configuration.get('unitSystemWeight') || preferedUnitSystem, intl, previousAttributes.weightInMicrograms));
      }

      if (currentAttributes.distance || previousAttributes.distance) {
        stringParts.push(lengthTransform(currentAttributes.distance, configuration.get('unitSystemLength') || preferedUnitSystem, intl, previousAttributes.distance));
      }

      if (currentAttributes.duration || previousAttributes.duration) {
        stringParts.push(durationTransform(currentAttributes.duration, intl, previousAttributes.duration));
      }

      if (currentAttributes.laps || previousAttributes.laps) {
        stringParts.push(quantityTransform(currentAttributes.laps, 'laps', intl, previousAttributes.laps));
      }

      if (currentAttributes.reps || previousAttributes.reps) {
        stringParts.push(quantityTransform(currentAttributes.reps, 'reps', intl, previousAttributes.reps));
      }

      if (currentAttributes.sets || previousAttributes.sets) {
        stringParts.push(quantityTransform(currentAttributes.sets, 'sets', intl, previousAttributes.sets));
      }

      return Ember.String.htmlSafe(stringParts.length > 0 ? `${stringParts.join(' ')}, ${frequency}` : frequency);
    }
  }),

  frequency: Ember.computed({
    get() {
      const { intl, previousInstance, routineInstance } = this.getProperties('intl', 'previousInstance', 'routineInstance');
      const { frequency, frequencyScale } = routineInstance.getProperties('frequency', 'frequencyScale');
      const { frequency: previousFrequency, frequencyScale: previousFrequencyScale } = previousInstance.getProperties('frequency', 'frequencyScale');
      if (Ember.isBlank(frequency) || Ember.isBlank(frequencyScale)) return '';

      const frequencyChanged = frequency !== previousFrequency && Ember.isPresent(previousFrequency);
      const frequencyScaleChanged = frequencyScale !== previousFrequencyScale && Ember.isPresent(previousFrequencyScale);
      let frequencyTranslation = frequencyScale === 0 ? '' : intl.t('routine.frequency.frequency', { frequency });
      let frequencyScaleTranslation = intl.t(`routine.frequency.scale.${frequencyScale}`);
      const previousFrequencyTranslation = previousFrequencyScale === 0 ? '' : intl.t('routine.frequency.frequency', { frequency: previousFrequency });
      const previousFrequencyScaleTranslation = intl.t(`routine.frequency.scale.${previousFrequencyScale}`)
      let text = '';

      if (frequencyChanged && frequencyScaleChanged) {
        text = intl.t('routine.level.format', {
          current: intl.t('routine.frequency.format', { frequency: frequencyTranslation, frequencyScale: frequencyScaleTranslation }),
          previous: intl.t('routine.frequency.format', { frequency: previousFrequencyTranslation, frequencyScale: previousFrequencyScaleTranslation })
        });
      } else {
        if (frequencyChanged) {
          frequencyTranslation = intl.t('routine.level.format', { current: frequencyTranslation, previous: previousFrequencyTranslation });
        } else if (frequencyScaleChanged) {
          frequencyScaleTranslation = intl.t('routine.level.format', { current: frequencyScaleTranslation, previous: previousFrequencyScaleTranslation });
        }

        text = intl.t('routine.frequency.format', { frequency: frequencyTranslation, frequencyScale: frequencyScaleTranslation });
      }

      if ((frequencyChanged || frequencyScaleChanged) && (frequencyScale < previousFrequencyScale || (frequencyScale === previousFrequencyScale && frequency > previousFrequency))) {
        return intl.t('routine.level.up', { text });
      } else if ((frequencyChanged || frequencyScaleChanged) && (frequencyScale > previousFrequencyScale || (frequencyScale === previousFrequencyScale && frequency < previousFrequency))) {
        return intl.t('routine.level.down', { text });
      } else {
        return text;
      }
    }
  })
});
