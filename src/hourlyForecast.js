import { formatLocalTime, formatTemperature, twoDigits } from "./utils";

const HOURLY_FORECAST_LIST_LENGTH = 24;

export function getHourlyForecast(location, forecast) {
  const hourlyForecastList = [];
  const localTime = formatLocalTime(location.localtime);

  const multiDaysForecastList = forecast.forecastday;

  const multiDaysHourlyForecastList = [];

  for (let i = 0; i < multiDaysForecastList.length; i++) {
    const hourlyForecast = multiDaysForecastList[i].hour;
    hourlyForecast.forEach((item) => {
      multiDaysHourlyForecastList.push(item);
      return multiDaysHourlyForecastList;
    });
  }

  const indexLocalTime = multiDaysHourlyForecastList.findIndex((hour) => {
    return hour.time === localTime;
  });

  multiDaysHourlyForecastList.splice(0, indexLocalTime);

  for (let i = 0; i < HOURLY_FORECAST_LIST_LENGTH; i++) {
    const date = new Date(multiDaysHourlyForecastList[i].time);

    const hourlyForecastData = {
      date: formatLocalTime(date),
      hour: twoDigits(date.getHours()) + " Uhr",
      temperature: formatTemperature(multiDaysHourlyForecastList[i].temp_c),
      icon: "https:" + multiDaysHourlyForecastList[i].condition.icon,
    };

    hourlyForecastList.push(hourlyForecastData);
  }

  const currentTime = "Jetzt";
  hourlyForecastList[0].hour = currentTime;

  return hourlyForecastList;
}
