import Ember from 'ember';
import fixNumber from './fix-number';

const convertMillimeters = function convertMillimeters(value, unitSystem) {
  if (!value) return { unit: 'none', originalValue: 0, volume: 0 };

  if (unitSystem === 'english' || unitSystem === 'english-us') {
    const isImperial = unitSystem === 'english';
    const microlitersInATeaspoon = isImperial ? 5919 : 4929;
    const microlitersInATablespoon = isImperial ? 17758 : 14787;
    const microlitersInACup = isImperial ? 284131 : 240000;
    const microlitersInAGallon = isImperial ? 4546090 : 3785410;

    if (value < microlitersInATablespoon) return { unit: 'teaspoons', volume: fixNumber(value / microlitersInATeaspoon), originalValue: value };
    else if (value < microlitersInACup / 4) return { unit: 'tablespoons', volume: fixNumber(value / microlitersInATablespoon), originalValue: value };
    else if (value < microlitersInAGallon / 4) return { unit: 'cups', volume: fixNumber(value / microlitersInACup), originalValue: value };
    else return { unit: 'gallons', volume: fixNumber(value / microlitersInAGallon), originalValue: value };
  } else {
    if (value < 1000) return { unit: 'microliters', volume: value, originalValue: value };
    else if (value < 100000) return { unit: 'milliliters', volume: fixNumber(value / 1000), originalValue: value };
    else if (value < 100000000) return { unit: 'liters', volume: fixNumber(value / 1000000), originalValue: value };
    return { unit: 'kiloliters', volume: fixNumber(value / 1000000000), originalValue: value };
  }
}

export default function volume(currentMicroliters, unitSystem, intl, previousMicroliters) {
  const currentValue = convertMillimeters(currentMicroliters, unitSystem);
  const previousValue = convertMillimeters(previousMicroliters, unitSystem);

  if (currentMicroliters === previousMicroliters) {
    return intl.t(`routine.volume.${currentValue.unit}`, currentValue);
  } else if (currentValue.unit === previousValue.unit) {
    const level = intl.t('routine.level.format', { current: currentValue.volume, previous: previousValue.volume });
    const text = intl.t(`routine.volume.${currentValue.unit}`, { volume: level });

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { text }) :
      intl.t('routine.level.up', { text });
  } else {
    const current = intl.t(`routine.volume.${currentValue.unit}`, currentValue);
    const previous = intl.t(`routine.volume.${previousValue.unit}`, previousValue);
    const text = intl.t('routine.level.format', { current, previous });

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { text }) :
      intl.t('routine.level.up', { text });
  }
}
