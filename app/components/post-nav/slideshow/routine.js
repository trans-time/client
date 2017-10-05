import Ember from 'ember';
import lengthTransform from 'client/utils/length';

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
      const attributes = ['distance', 'duration', 'reps', 'sets', 'weight'];
      const { previousInstance, routineInstance } = this.getProperties('previousInstance', 'routineInstance');
      const currentAttributes = routineInstance.getProperties(...attributes);
      const previousAttributes = previousInstance.getProperties(...attributes);

      if (Ember.isPresent(currentAttributes.distance)) {
        return  Ember.String.htmlSafe(`${lengthTransform(currentAttributes.distance, 'english', intl, previousAttributes.distance)}, ${frequency}`);
      }
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
    if (Ember.isBlank(frequency) || Ember.isBlank(scale)) return;

    const intl = this.get('intl');

    return intl.t(`routine.frequencyScale.${scale}`, { frequency: intl.t('routine.frequency', { frequency }) });
  }
});
