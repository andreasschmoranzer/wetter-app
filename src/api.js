const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "a52a3c13c4f94a06810125930262404";

export async function getCurrentWeatherAndForecast(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${days}`,
  );
  const weatherData = await response.json();
  return weatherData;
}
