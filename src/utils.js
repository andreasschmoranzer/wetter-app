export function formatTemperature(temperature) {
  return Math.floor(temperature);
}

export function formatWindSpeed(windSpeed) {
  return Math.floor(windSpeed);
}

export function formatLocalTime(currentTime) {
  const localTime = new Date(currentTime);

  const year = localTime.getFullYear();
  const month = twoDigits(localTime.getMonth() + 1);
  const day = twoDigits(localTime.getDate());
  const hours = twoDigits(localTime.getHours());
  const minutes = "00";

  const timeAndDateFormat =
    year + "-" + month + "-" + day + " " + hours + ":" + minutes;

  return timeAndDateFormat;
}

export function twoDigits(value) {
  if (value < 10) {
    value = "0" + value;
  } else {
    value = value;
  }
  return value;
}
