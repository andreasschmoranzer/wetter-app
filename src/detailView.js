import { getCurrentWeatherAndForecast } from "./api";
import { rootEl } from "./main";
import { roundOff } from "./utils";
import { renderLoadingScreen } from "./loadingScreen";
import { get24HourForecast } from "./utils";

export async function loadDetailView(enteredLocation) {
  renderLoadingScreen("Lade das Wetter für " + enteredLocation + "...");

  const weatherData = await getCurrentWeatherAndForecast(enteredLocation);
  renderDetailView(weatherData);
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootEl.innerHTML =
    displayDetailView(
      location.name,
      roundOff(current.temp_c),
      current.condition.text,
      roundOff(currentDay.day.maxtemp_c),
      roundOff(currentDay.day.mintemp_c),
    ) +
    displayHourlyForecast(
      currentDay.day.condition.text,
      roundOff(currentDay.day.maxwind_kph),
      get24HourForecast(location, forecast),
    ) +
    displayThreeDaysForecast(forecast.forecastday);
}

function displayDetailView(
  location,
  currentTemperature,
  condition,
  maxTemp,
  minTemp,
) {
  return `
      <div class="current-weather">
        <h2 class="current-weather__location">${location}</h2>
        <p class="current-weather__current-temperature">${currentTemperature}°</p>
        <p class="current-weather__condition">${condition}</p>
        <div class="current-weather__temperatures">
          <span class="current-weather__max-temperature">H: ${maxTemp}°</span>
          <span class="current-weather__min-temperature">T: ${minTemp}°</span>
        </div>
      </div>`;
}

function displayHourlyForecast(
  forecastCondition,
  maxWindSpeed,
  hourlyForecastList,
) {
  let forecastPerHour = "";

  hourlyForecastList
    .filter((el) => el !== undefined)
    .forEach((hour, i) => {
      forecastPerHour += `
        <div class="hourly-forecast">
          <p class="hourly-forecast__time">${i === 0 ? "Jetzt" : hour.hour === "00" ? "0 Uhr" : hour.hour + " Uhr"}</p>
          <img src="${"https:" + hour.icon}" class="hourly-forecast__icon"/>
          <p class="hourly-forecast__temperature">${hour.temperature}°</p>
        </div>`;
    });

  let html = `
    <div class="todays-forecast">
      <p class="todays-forecast__summary">Heute ${forecastCondition}. Wind bis zu ${maxWindSpeed} km/h.</p>
      <div class="todays-forecast__hours">
      ${forecastPerHour}
      </div>
    </div>`;

  return html;
}

function displayThreeDaysForecast(forecastDays) {
  let forecastPerDay = "";

  forecastDays
    .filter((el) => el !== undefined)
    .forEach((day, i) => {
      forecastPerDay += `
      <div class="daily-forecast">
        <p class="daily-forecast__day">${i === 0 ? "Heute" : day.date}</p>
        <img src="${"https:" + day.day.condition.icon}" class="daily-forecast__icon"/>
        <p class="daily-forecast__max-temperature">H: ${roundOff(day.day.maxtemp_c) + "°"}</p>
        <p class="daily-forecast__min-temperature">T: ${roundOff(day.day.mintemp_c) + "°"}</p>
        <p class="daily-forecast__wind">Wind: ${roundOff(day.day.maxwind_kph) + " km/h"}</p>
      </div>
    `;
    });

  let html = `
  <div class="three-days-forecast">
    <p class="three-days-forecast__title">Vorhersage für ${forecastDays.length === 1 ? "den heutigen Tag:" : "die nächsten " + forecastDays.length + " Tage:"}</p>
    <div class="three-days-forecast__days">
      ${forecastPerDay}
    </div>
  </div>
  `;

  return html;
}
