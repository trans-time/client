import Ember from 'ember';
import fixNumber from './fix-number';

const convertMillimeters = function convertMillimeters(value, unitSystem) {
  if (!value) return { unit: 'none', originalValue: 0, quantity: 0 };

  if (unitSystem === 'english') {
    const quantityInAnOunce = 28349523;
    const quantityInAPound = 453592370;

    if (value < quantityInAPound) return { unit: 'ounces', quantity: fixNumber(value / quantityInAnOunce), originalValue: value };
    else return { unit: 'pounds', quantity: fixNumber(value / quantityInAPound), originalValue: value };
  } else {
    if (value < 1000) return { unit: 'quantity', quantity: value, originalValue: value };
    else if (value < 100000) return { unit: 'milligrams', quantity: fixNumber(value / 1000), originalValue: value };
    else if (value < 100000000) return { unit: 'grams', quantity: fixNumber(value / 1000000), originalValue: value };
    return { unit: 'kilograms', quantity: fixNumber(value / 1000000000), originalValue: value };
  }
}

export default function quantity(currentQuantity, unit, intl, previousQuantity) {
  if (currentQuantity === previousQuantity) {
    return intl.t(`routine.quantity.${unit}`, { quantity: currentQuantity, currentQuantity });
  } else {
    const level = intl.t('routine.level.format', { current: currentQuantity, previous: previousQuantity });
    const text = intl.t(`routine.quantity.${unit}`, { quantity: level, currentQuantity });

    return currentQuantity < previousQuantity ?
      intl.t('routine.level.down', { text }) :
      intl.t('routine.level.up', { text });
  }
}
