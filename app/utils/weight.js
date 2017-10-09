import Ember from 'ember';
import fixNumber from './fix-number';

const convertMillimeters = function convertMillimeters(value, unitSystem) {
  if (!value) return { unit: 'none', originalValue: 0, weight: 0 };

  if (unitSystem === 'english') {
    const microgramsInAnOunce = 28349523;
    const microgramsInAPound = 453592370;

    if (value < microgramsInAPound) return { unit: 'ounces', weight: fixNumber(value / microgramsInAnOunce), originalValue: value };
    else return { unit: 'pounds', weight: fixNumber(value / microgramsInAPound), originalValue: value };
  } else {
    if (value < 1000) return { unit: 'micrograms', weight: value, originalValue: value };
    else if (value < 100000) return { unit: 'milligrams', weight: fixNumber(value / 1000), originalValue: value };
    else if (value < 100000000) return { unit: 'grams', weight: fixNumber(value / 1000000), originalValue: value };
    return { unit: 'kilograms', weight: fixNumber(value / 1000000000), originalValue: value };
  }
}

export default function weight(currentMicrograms, unitSystem, intl, previousMicrograms) {
  const currentValue = convertMillimeters(currentMicrograms, unitSystem);
  const previousValue = convertMillimeters(previousMicrograms, unitSystem);

  if (currentMicrograms === previousMicrograms) {
    return intl.t(`routine.weight.${currentValue.unit}`, currentValue);
  } else if (currentValue.unit === previousValue.unit) {
    const level = currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { current: currentValue.weight, previous: previousValue.weight }) :
      intl.t('routine.level.up', { current: currentValue.weight, previous: previousValue.weight });

    return intl.t(`routine.weight.${currentValue.unit}`, { weight: level });
  } else {
    const current = intl.t(`routine.weight.${currentValue.unit}`, currentValue);
    const previous = intl.t(`routine.weight.${previousValue.unit}`, previousValue);

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { current, previous }) :
      intl.t('routine.level.up', { current, previous });
  }
}
