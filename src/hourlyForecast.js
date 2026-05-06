import { formatLocalTime, formatTemperature } from "./utils";

const REQUIRED_DAILY_FORECAST_LENGTH = 24;

export function getHourlyForecast(location, currentDay, forecast) {
  const localTime = formatLocalTime(location.localtime);

  const forecastDays = forecast.forecastday;
  const filteredForecastDays = forecastDays.filter(
    (day) => day.date !== currentDay.date,
  );

  const hoursOfCurrentDay = currentDay.hour;

  const indexLocalTime = hoursOfCurrentDay.findIndex((hour) => {
    return hour.time === localTime;
  });

  let dailyForecast = [];
  let hourlyForecastData = {};

  for (let i = indexLocalTime; i < hoursOfCurrentDay.length; i++) {
    createHourlyForecastData(
      hoursOfCurrentDay[i],
      hourlyForecastData,
      dailyForecast,
    );
  }

  for (let i = 0; dailyForecast.length < REQUIRED_DAILY_FORECAST_LENGTH; i++) {
    let index = 0;
    if (filteredForecastDays[index].length === 0) {
      index++;
    } else {
      const forecastDaysHours = filteredForecastDays[index].hour;
      createHourlyForecastData(
        forecastDaysHours[i],
        hourlyForecastData,
        dailyForecast,
      );
    }
  }

  return dailyForecast;
}

function createHourlyForecastData(weatherData, forecastObject, forecastList) {
  const date = new Date(weatherData.time);

  forecastObject = {
    date: formatLocalTime(date),
    hour: date.getHours() + " Uhr",
    temperature: formatTemperature(weatherData.temp_c),
    icon: "https:" + weatherData.condition.icon,
  };

  forecastList.push(forecastObject);

  const currentHour = "Jetzt";
  forecastList[0].hour = currentHour;

  return forecastList;
}
