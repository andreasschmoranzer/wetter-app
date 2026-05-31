const API_BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = "a52a3c13c4f94a06810125930262404";

export async function getCurrentWeatherAndForecast(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=id:${location}&lang=de&days=${days}`,
  );
  const weatherData = await response.json();
  return weatherData;
}

export async function getSearchResults(location) {
  const response = await fetch(
    `${API_BASE_URL}/search.json?key=${API_KEY}&q=${location}`,
  );
  const searchResults = await response.json();
  return searchResults;
}
