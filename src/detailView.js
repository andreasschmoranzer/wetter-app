import { getCurrentWeatherAndForecast } from "./api";
import { rootEl } from "./main";
import { formatTemperature, formatWindSpeed } from "./utils";
import { renderLoadingScreen } from "./loadingScreen";
import { getHourlyForecast } from "./hourlyForecast";

export async function loadDetailView(enteredLocation) {
  renderLoadingScreen("Lade das Wetter für " + enteredLocation + "...");

  const weatherData = await getCurrentWeatherAndForecast(enteredLocation);
  renderDetailView(weatherData);
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const hourlyForecast = getHourlyForecast(location, forecast);

  rootEl.innerHTML = displayDetailView(
    location.name,
    formatTemperature(current.temp_c),
    current.condition.text,
    formatTemperature(currentDay.day.maxtemp_c),
    formatTemperature(currentDay.day.mintemp_c),
    currentDay.day.condition.text,
    formatWindSpeed(currentDay.day.maxwind_kph),
    hourlyForecast,
  );
}

function displayDetailView(
  location,
  currentTemperature,
  condition,
  maxTemp,
  minTemp,
  forecastCondition,
  maxWindSpeed,
  hourlyForecast,
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
      </div>
      <div class="todays-forecast">
        <p class="todays-forecast__summary">Heute ${forecastCondition}. Wind bis zu ${maxWindSpeed} km/h.</p>
        <div class="todays-forecast__hours">
        ${displayHourlyForecast(hourlyForecast)}
        </div>
      </div>
  `;
}

function displayHourlyForecast(hourelyForecastList) {
  let html = "";
  hourelyForecastList.forEach((hour) => {
    html += `<div class="hourly-forecast">
              <p class="hourly-forecast__time">${hour.hour}</p>
              <img src="${hour.icon}" class="hourly-forecast__icon"/>
              <p class="hourly-forecast__temperature">${hour.temperature}°</p>
            </div>`;
  });
  return html;
}
