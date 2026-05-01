const API_ENDPOINT_FORECAST =
  "http://api.weatherapi.com/v1/forecast.json?key=a52a3c13c4f94a06810125930262404";
const API_PARAMETER_Q = "&q=";
const API_PARAMETER_LANG = "&lang=de";

export async function fetchApiWeatherForecast(location) {
  const response = await fetch(
    API_ENDPOINT_FORECAST + API_PARAMETER_Q + location + API_PARAMETER_LANG,
  );
  const weatherData = await response.json();
  console.log(weatherData);
  return weatherData;
}
