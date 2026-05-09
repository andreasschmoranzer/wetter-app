export function roundOff(value) {
  return Math.floor(value);
}

function twoDigits(value) {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}

export function get24HourForecast(location, forecast) {
  const NEW_FORECAST_LIST_LENGTH = 24;
  const newForecastList = [];

  const localTime = location.localtime;

  const time = localTime.split(":");
  const formatLocalTime = time[0] + ":00";

  const multiDaysForecastList = forecast.forecastday;
  const mergedMultiDaysForecastList = [];

  for (let i = 0; i < multiDaysForecastList.length; i++) {
    const hourlyForecast = multiDaysForecastList[i].hour;
    hourlyForecast.forEach((item) => {
      mergedMultiDaysForecastList.push(item);
      return mergedMultiDaysForecastList;
    });
  }

  const indexLocalTime = mergedMultiDaysForecastList.findIndex((hour) => {
    return hour.time === formatLocalTime;
  });

  for (
    let i = indexLocalTime;
    newForecastList.length < NEW_FORECAST_LIST_LENGTH;
    i++
  ) {
    const date = mergedMultiDaysForecastList[i].time.split(" ");
    const hour = date[1].split(":");

    const hourlyForecastEl = {
      time: mergedMultiDaysForecastList[i].time,
      hour: hour[0],
      temperature: roundOff(mergedMultiDaysForecastList[i].temp_c),
      icon: mergedMultiDaysForecastList[i].condition.icon,
    };

    newForecastList.push(hourlyForecastEl);
  }

  return newForecastList;
}

export function formatDay(currentDate) {
  const date = new Date(currentDate);
  const dayEl = date.getDay();

  let days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];

  let day = days.filter((element, index) => {
    return (element, index === dayEl);
  });

  return day;
}

export function formatTime(currentTime) {
  const time = new Date(currentTime);

  const hour = twoDigits(time.getHours());
  const minutes = twoDigits(time.getMinutes());

  const merchedTime = hour + ":" + minutes;

  return merchedTime;
}
