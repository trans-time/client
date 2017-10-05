import Ember from 'ember';
import fixNumber from './fix-number';

const convertMillimeters = function convertMillimeters(value, unitSystem) {
  if (Ember.isBlank(value)) return;

  if (unitSystem === 'english') {
    const twelveFeet = 3657;
    const tenthAMile = 160934;

    if (value < twelveFeet) return { unit: 'inches', length: fixNumber(value * 0.0393701), originalValue: value };
    else if (value < tenthAMile) return { unit: 'yards', length: fixNumber(value * 0.00109361), originalValue: value };
    else return { unit: 'miles', length: fixNumber(value * 0.000000621371), originalValue: value };
  } else {
    if (value < 10) return { unit: 'value', length: value, originalValue: value };
    else if (value < 10000) return { unit: 'centimeters', length: fixNumber(value / 10), originalValue: value };
    else if (value < 100000) return { unit: 'meters', length: fixNumber(value / 1000), originalValue: value };
    return { unit: 'kilometers', length: fixNumber(value / 1000000), originalValue: value };
  }
}

export default function length(currentMillimeters, unitSystem, intl, previousMillimeters) {
  const currentValue = convertMillimeters(currentMillimeters, unitSystem);
  const previousValue = convertMillimeters(previousMillimeters, unitSystem);

  if (currentMillimeters === previousMillimeters || Ember.isBlank(previousMillimeters)) {
    return intl.t(`routine.length.${unitSystem}.${currentValue.unit}`, currentValue);
  } else if (currentValue.unit === previousValue.unit) {
    const level = currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { current: currentValue.length, previous: previousValue.length }) :
      intl.t('routine.level.up', { current: currentValue.length, previous: previousValue.length });

    return intl.t(`routine.length.${unitSystem}.${currentValue.unit}`, { length: level });
  } else {
    const current = intl.t(`routine.length.${unitSystem}.${currentValue.unit}`, currentValue);
    const previous = intl.t(`routine.length.${unitSystem}.${previousValue.unit}`, previousValue);

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { current, previous }) :
      intl.t('routine.level.up', { current, previous });
  }
}
