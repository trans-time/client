import Ember from 'ember';
import fixNumber from './fix-number';

const convertMillimeters = function convertMillimeters(value, unitSystem) {
  if (!value) return { unit: 'none', originalValue: 0, length: 0 };

  if (unitSystem === 'english') {
    const twelveFeet = 3657;
    const tenthAMile = 160934;

    if (value < twelveFeet) return { unit: 'inches', length: fixNumber(value * 0.0393701), originalValue: value };
    else if (value < tenthAMile) return { unit: 'yards', length: fixNumber(value * 0.00109361), originalValue: value };
    else return { unit: 'miles', length: fixNumber(value * 0.000000621371), originalValue: value };
  } else {
    if (value < 10) return { unit: 'millimeters', length: value, originalValue: value };
    else if (value < 10000) return { unit: 'centimeters', length: fixNumber(value / 10), originalValue: value };
    else if (value < 100000) return { unit: 'meters', length: fixNumber(value / 1000), originalValue: value };
    return { unit: 'kilometers', length: fixNumber(value / 1000000), originalValue: value };
  }
}

export default function length(currentMillimeters, unitSystem, intl, previousMillimeters) {
  const currentValue = convertMillimeters(currentMillimeters, unitSystem);
  const previousValue = convertMillimeters(previousMillimeters, unitSystem);

  if (currentMillimeters === previousMillimeters) {
    return intl.t(`routine.length.${currentValue.unit}`, currentValue);
  } else if (currentValue.unit === previousValue.unit) {
    const level = intl.t('routine.level.format', { current: currentValue.length, previous: previousValue.length });
    const text = intl.t(`routine.length.${currentValue.unit}`, { length: level });

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { text }) :
      intl.t('routine.level.up', { text });
  } else {
    const current = intl.t(`routine.length.${currentValue.unit}`, currentValue);
    const previous = intl.t(`routine.length.${previousValue.unit}`, previousValue);
    const text = intl.t('routine.level.format', { current, previous });

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { text }) :
      intl.t('routine.level.up', { text });
  }
}
