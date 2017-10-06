import Ember from 'ember';

const convertMilliseconds = function convertMilliseconds(value) {
  if (Ember.isBlank(value)) return;

  const millisecondsInAnHour = 3600000;
  const millisecondsInAMinute = 60000;
  const millisecondsInASecond = 1000;

  const hours = Math.floor(value / millisecondsInAnHour);
  const minutes = Math.floor((value % millisecondsInAnHour) / millisecondsInAMinute);
  const seconds = Math.floor(((value % millisecondsInAnHour) % millisecondsInAMinute) / millisecondsInASecond);
  const milliseconds = ((value % millisecondsInAnHour) % millisecondsInAMinute) % millisecondsInASecond;

  let unit;
  if (hours > 0 && minutes === 0 && seconds === 0) {
    unit = 'hoursOnly';
  } else if (hours > 0 && seconds === 0) {
    unit = 'hoursAndMinutes';
  } else if (hours > 0) {
    unit = 'hoursMinutesAndSeconds';
  } else if (minutes > 0 && seconds === 0) {
    unit = 'minutesOnly';
  } else if (minutes > 0) {
    unit = 'minutesAndSeconds';
  } else if (seconds > 0 && milliseconds === 0) {
    unit = 'secondsOnly';
  } else if (seconds > 0) {
    unit = 'secondsAndMilliseconds';
  } else {
    unit = 'millisecondsOnly';
  }

  return { unit, hours, minutes, seconds, milliseconds, originalValue: value };
}

const formatDuration = function formatDuration(currentMilliseconds, intl, previousMilliseconds) {
  const currentValue = convertMilliseconds(currentMilliseconds);
  const previousValue = convertMilliseconds(previousMilliseconds);

  if (currentMilliseconds === previousMilliseconds || Ember.isBlank(previousMilliseconds)) {
    return intl.t(`routine.duration.${currentValue.unit}`, currentValue);
  } else {
    const current = intl.t(`routine.duration.${currentValue.unit}`, currentValue);
    const previous = intl.t(`routine.duration.${previousValue.unit}`, previousValue);

    return currentValue.originalValue < previousValue.originalValue ?
      intl.t('routine.level.down', { current, previous }) :
      intl.t('routine.level.up', { current, previous });
  }
}

export default function duration(currentMilliseconds, intl, previousMilliseconds) {
  const duration = formatDuration(currentMilliseconds, intl, previousMilliseconds);

  return intl.t('routine.duration.format', { duration });
}
