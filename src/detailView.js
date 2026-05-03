import { getCurrentWeatherAndForecast } from "./api";
import { rootEl } from "./main";
import { formatTemperature } from "./utils";
import { renderLoadingScreen } from "./loadingScreen";

export async function loadDetailView(enteredLocation) {
  renderLoadingScreen("Lade das Wetter für " + enteredLocation + "...");

  const weatherData = await getCurrentWeatherAndForecast(enteredLocation);
  renderDetailView(weatherData);
}

function renderDetailView(weatherData) {
  // destructuring Schreibweise.
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootEl.innerHTML = displayDetailView(
    location.name,
    formatTemperature(current.temp_c),
    current.condition.text,
    formatTemperature(currentDay.day.maxtemp_c),
    formatTemperature(currentDay.day.mintemp_c),
  );
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
      </div>
  `;
}
