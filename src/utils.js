export function roundOff(value) {
  return Math.floor(value);
}

export function get24HourForecast(location, forecast) {
  const NEW_FORECAST_LIST_LENGTH = 24;
  const newForecastList = [];

  const localTime = location.localtime;

  const time = localTime.split(":");
  time.splice(1, 1);
  const formatLocalTime = time + ":00";

  const mulitDaysForecastList = forecast.forecastday;
  const mergedMultiDaysForecastList = [];

  for (let i = 0; i < mulitDaysForecastList.length; i++) {
    const hourlyForecast = mulitDaysForecastList[i].hour;
    hourlyForecast.forEach((item) => {
      mergedMultiDaysForecastList.push(item);
      return mergedMultiDaysForecastList;
    });
  }

  const indexLocalTime = mergedMultiDaysForecastList.findIndex((hour) => {
    return hour.time === formatLocalTime;
  });

  mergedMultiDaysForecastList.splice(0, indexLocalTime);

  for (let i = 0; i < NEW_FORECAST_LIST_LENGTH; i++) {
    const date = mergedMultiDaysForecastList[i].time.split(" ");
    const hour = date[1].split(":");

    const hourlyForecastElements = {
      time: mergedMultiDaysForecastList[i].time,
      hour: hour[0],
      temperature: roundOff(mergedMultiDaysForecastList[i].temp_c),
      icon: mergedMultiDaysForecastList[i].condition.icon,
    };

    newForecastList.push(hourlyForecastElements);
  }

  return newForecastList;
}
