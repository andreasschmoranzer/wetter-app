const LOCALSTORAGE_KEY = "favorites";

export function saveToFavorites(location) {
  const favoriteLocations = getFavoritesFromLocalstorage();

  const favoriteLocation = {
    location,
    text: "Hallo",
  };

  console.log();

  if (
    favoriteLocations.find((item) => item.location === location) === undefined
  ) {
    favoriteLocations.push(favoriteLocation);
    saveToLocalstorage(favoriteLocations);
  } else {
    alert(location + " wurde bereits gespeichert!");
    return;
  }
}

function saveToLocalstorage(favoriteLocationsList) {
  const favoritesListLocalstorage = localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify(favoriteLocationsList),
  );

  return favoritesListLocalstorage;
}

function getFavoritesFromLocalstorage() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
}
