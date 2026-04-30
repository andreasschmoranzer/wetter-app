export const API_ENDPOINT =
  "http://api.weatherapi.com/v1/forecast.json?key=a52a3c13c4f94a06810125930262404&q=";

export async function fetchApi(currentLocation) {
  const response = await fetch(API_ENDPOINT + currentLocation);
  const weatherInformation = await response.json();
  return weatherInformation;
}
