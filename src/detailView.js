import { getCurrentWeatherAndForecast } from "./api";
import { rootEl } from "./main";
import { renderLoadingScreen } from "./loadingScreen";
import {
  roundOff,
  get24HourForecast,
  formatDay,
  formatTime,
  checkDuplicateFavoriteItems,
} from "./utils";
import { saveToFavorites } from "./saveFavorites";
import { getConditionImagePath } from "./conditions";
import { loadMainMenu } from "./mainMenu";
import { applyDragAndScroll } from "./dragAndScroll";
import { hideSearchResults } from "./mainMenu";

export async function loadDetailView(locationId, locationName) {
  renderLoadingScreen("Lade das Wetter für " + locationName + "...");

  rootEl.removeEventListener("click", hideSearchResults);

  const weatherData = await getCurrentWeatherAndForecast(locationId);
  renderDetailView(weatherData);

  checkDuplicateFavoriteItems(locationId);

  applyActionsEventlistener(locationId);

  applyDragAndScroll();
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const conditionImage = getConditionImagePath(
    current.condition.code,
    current.is_day !== 1,
  );

  if (conditionImage) {
    rootEl.style = `--detail-condition-image: url(${conditionImage})`; //CSS Variable!
    rootEl.classList.add("show-background");
  }

  rootEl.innerHTML =
    displayActionButtons() +
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
    displayThreeDaysForecast(forecast.forecastday) +
    displayWeatherDetails(current, currentDay);
}

function displayActionButtons() {
  return `
  <div class="actions">
    <button class="actions__return">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="actions__return-icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </button>
    <button class="actions__favorites">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="actions__favorites-icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    </button>
  </div>`;
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

function displayThreeDaysForecast(forecastDaysElements) {
  let forecastPerDay = "";

  forecastDaysElements
    .filter((el) => el !== undefined)
    .forEach((day, i) => {
      forecastPerDay += `
      <div class="daily-forecast">
        <p class="daily-forecast__day">${i === 0 ? "Heute" : formatDay(day.date)}</p>
        <img src="${"https:" + day.day.condition.icon}" class="daily-forecast__icon"/>
        <p class="daily-forecast__max-temperature">H: ${roundOff(day.day.maxtemp_c) + "°"}</p>
        <p class="daily-forecast__min-temperature">T: ${roundOff(day.day.mintemp_c) + "°"}</p>
        <p class="daily-forecast__wind">Wind: ${day.day.maxwind_kph + " km/h"}</p>
      </div>
    `;
    });

  let html = `
  <div class="three-days-forecast">
    <p class="three-days-forecast__title">Vorhersage für ${forecastDaysElements.length === 1 ? "den heutigen Tag:" : "die nächsten " + forecastDaysElements.length + " Tage:"}</p>
    <div class="three-days-forecast__days">
      ${forecastPerDay}
    </div>
  </div>
  `;

  return html;
}

function displayWeatherDetails(current, currentDay) {
  return `
  <div class="weather-details">
    <div class="weather-detail">
      <p class="weather-detail__key">Feuchtigkeit</p>
      <p class="weather-detail__value">${current.humidity}%</p>
    </div>
    <div class="weather-detail">
      <p class="weather-detail__key">Gefühlt</p>
      <p class="weather-detail__value">${current.feelslike_c}°</p>
    </div>
    <div class="weather-detail">
      <p class="weather-detail__key">Sonnenaufgang</p>
      <p class="weather-detail__value">${formatTime(currentDay.date + " " + currentDay.astro.sunrise)} Uhr</p>
    </div>
    <div class="weather-detail">
      <p class="weather-detail__key">Sonnenuntergang</p>
      <p class="weather-detail__value">${formatTime(currentDay.date + " " + currentDay.astro.sunset)} Uhr</p>
    </div>
    <div class="weather-detail">
      <p class="weather-detail__key">Niederschlag</p>
      <p class="weather-detail__value">${current.precip_mm} mm</p>
    </div>
    <div class="weather-detail">
      <p class="weather-detail__key">UV-Index</p>
      <p class="weather-detail__value">${current.uv}</p>
    </div>
  </div>
  `;
}

function applyActionsEventlistener(location) {
  const returnToMainMenuButtonEl = document.querySelector(
    ".actions__return-icon",
  );

  const saveToFavoritesButtonEl = document.querySelector(
    ".actions__favorites-icon",
  );

  returnToMainMenuButtonEl.addEventListener("click", () => {
    rootEl.classList.remove("show-background");
    loadMainMenu();
  });

  if (!saveToFavoritesButtonEl) {
    return;
  } else {
    saveToFavoritesButtonEl.addEventListener("click", () => {
      saveToFavorites(location);
      saveToFavoritesButtonEl.remove();
    });
  }
}
