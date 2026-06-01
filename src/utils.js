import { getFavoritesFromLocalstorage } from "./saveFavorites";
import { getCurrentWeatherAndForecast } from "./api";

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

  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return days[dayEl];

  /* let day = days.filter((element, index) => {
    return (element, index === dayEl);
  });

  return day; */
}

export function formatTime(time) {
  const sunEvent = time;
  const sunEventWithoutSuffix = sunEvent.split(" ");
  const [hour, minutes] = sunEventWithoutSuffix[0].split(":");

  let merchedTime = hour + ":" + minutes;

  if (sunEvent.includes("PM")) {
    const sunset = Number(hour) + 12;

    merchedTime = String(sunset) + ":" + minutes;
    console.log(typeof merchedTime);
  }

  return merchedTime;

  // const [hour, minutes] = timeWithoutSuffix.split(":"); zb. 09:32 die erste Zahl wird in der Variable hour gespeichert und die zweite in der Variable minutes.
}

export async function getCurrentWeatherDataFavorites() {
  const favorites = getFavoritesFromLocalstorage();
  const favoriteElements = [];

  for (let i = 0; i < favorites.length; i++) {
    const weatherData = await getCurrentWeatherAndForecast(favorites[i]);

    const weatherDataEl = {
      id: favorites[i],
      weatherData,
    };

    favoriteElements.push(weatherDataEl);
  }

  return favoriteElements;
}

export function checkDuplicateFavoriteItems(location) {
  const favorites = getFavoritesFromLocalstorage();
  const findLocation = favorites.find((favorite) => favorite === location);

  if (findLocation === undefined) {
    return;
  } else {
    const saveToFavoritesButtonEl = document.querySelector(
      ".actions__favorites-icon",
    );
    return saveToFavoritesButtonEl.remove();
  }
}

export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
