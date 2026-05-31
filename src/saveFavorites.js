import { LOCALSTORAGE_KEY } from "./main";

export function saveToFavorites(location) {
  const favoriteLocations = getFavoritesFromLocalstorage();

  if (favoriteLocations.find((item) => item === location) === undefined) {
    favoriteLocations.push(location);
    saveToLocalstorage(favoriteLocations);
  } else {
    alert(location + " wurde bereits gespeichert!");
    return;
  }
}

export function deleteFavoriteItem(favoriteList, toDeleteFavoriteCity) {
  const toDeleteFavoriteIndex = favoriteList.findIndex(
    (favorite) => favorite === toDeleteFavoriteCity,
  );

  favoriteList.splice(toDeleteFavoriteIndex, 1);

  return saveToLocalstorage(favoriteList);
}

function saveToLocalstorage(favoriteLocationsList) {
  const favoritesListLocalstorage = localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify(favoriteLocationsList),
  );

  return favoritesListLocalstorage;
}

export function getFavoritesFromLocalstorage() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
}
