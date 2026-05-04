import { formatLocalTime, formatTemperature } from "./utils";

export function getForecastPerHour(location, currentDay, forecast) {
  const localTime = formatLocalTime(location.localtime);

  const forecastDays = forecast.forecastday;
  const filteredForecastDays = forecastDays.filter(
    (day) => day.date !== currentDay.date,
  );

  const currentDayHours = currentDay.hour;

  const findIndex = currentDayHours.findIndex((hour) => {
    return hour.time === localTime;
  });

  let forecastInHours = [];
  let forecastPerHour = {};

  for (let i = findIndex; i < currentDayHours.length; i++) {
    createForecastPerHourObject(
      currentDayHours[i],
      forecastPerHour,
      forecastInHours,
    );
  }

  for (let i = 0; forecastInHours.length < 24; i++) {
    let index = 0;
    if (filteredForecastDays[index].length === 0) {
      index++;
    } else {
      const forecastDaysHours = filteredForecastDays[index].hour;
      createForecastPerHourObject(
        forecastDaysHours[i],
        forecastPerHour,
        forecastInHours,
      );
    }
  }
  console.log(forecastInHours);
}

function createForecastPerHourObject(
  weatherData,
  forecastObject,
  forecastList,
) {
  const date = new Date(weatherData.time);
  forecastObject = {
    date: formatLocalTime(date),
    hour: date.getHours(),
    temperature: formatTemperature(weatherData.temp_c),
    icon: weatherData.condition.icon,
  };
  forecastList.push(forecastObject);
  return forecastList;
}

function displayForecastPerHour() {}
