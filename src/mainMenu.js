import { rootEl, SHOW_SEARCHRESULTS } from "./main";
import { roundOff, getCurrentWeatherDataFavorites, debounce } from "./utils";
import {
  deleteFavoriteItem,
  getFavoritesFromLocalstorage,
} from "./saveFavorites";
import { getConditionImagePath } from "./conditions";
import { loadDetailView } from "./detailView";
import {
  renderLoadingScreen,
  renderLoadingScreenSearchbar,
} from "./loadingScreen";
import { getSearchResults } from "./api";

export async function loadMainMenu() {
  renderLoadingScreen("Lade Übersicht...");

  const favoritesElements = await getCurrentWeatherDataFavorites();

  renderMainMenu(favoritesElements);
}

function renderMainMenu(favoritesList) {
  rootEl.innerHTML = `
  <div class="main-menu">
    ${displayMainMenu()}
    <div class="main-menu__favorites-list">
      ${displayFavoriteItems(favoritesList)}
    </div>
  </div>`;

  applyDetailViewEventlistener();
  applyMainMenuActionsEventlistener();
  applySearchbarEventlistener();
}

function displayMainMenu() {
  return `
  <div class="main-menu__header">
      <h1 class="main-menu__heading">Wetter</h1>
      <p class="main-menu__action">Bearbeiten</p>
  </div>
  <div class="main-menu__searchbar">
    <input
        class="main-menu__input"
        type="text"
        placeholder="Nach Stadt suchen..."
    />
    <div
      class="main-menu__search-results main-menu__search-results--disabled"
    ></div>
</div>
  `;
}

function displayFavoriteItems(favoritesList) {
  let html = "";

  if (favoritesList.length === 0) {
    html = "Es wurden noch keine Favoriten gespeichert.";
  }
  for (let i = 0; i < favoritesList.length; i++) {
    const { id } = favoritesList[i];
    const { current, forecast, location } = favoritesList[i].weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1,
    );

    html += `
      <div class="favorite-item" >
        <div class="delete-action delete-action--disabled">
            <div class="delete-action__box" data-name="${id}">
              <div class="delete-action__icon"></div>
            </div>
        </div>
        <div class="weather-data show-background" ${conditionImage ? `style="--condition-image: url(${conditionImage});"` : ""} data-name="${id}">
          <div class="weather-data__location-and-condition">
            <div class="weather-data__location-and-country">
              <p class="weather-data__location">${location.name}</p>
              <p class="weather-data__country">${location.country}</p>
            </div>
            <p class="weather-data__condition">${current.condition.text}</p>
          </div>
          <div class="weather-data__temperatures">
            <p class="weather-data__current-temperature">${roundOff(current.temp_c)}°</p>
            <div class="weather-data__min-max-temperatures">
              <span class="weather-data__max-temperature"> H: ${roundOff(currentDay.day.maxtemp_c)}° </span>
              <span class="weather-data__min-temperature"> T: ${roundOff(currentDay.day.mintemp_c)}° </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return html;
}

function applyDetailViewEventlistener() {
  const favoriteItemEls = document.querySelectorAll(".weather-data");

  favoriteItemEls.forEach((item) =>
    item.addEventListener("click", () =>
      loadDetailView(item.getAttribute("data-name")),
    ),
  );
}

function applyMainMenuActionsEventlistener() {
  const editButtonEl = document.querySelector(".main-menu__action");

  const favoriteItemsActionButtons =
    document.querySelectorAll(".delete-action");

  editButtonEl.addEventListener("click", () => {
    const EDIT_ATTRIBUTE = "data-edit-mode";

    if (!editButtonEl.getAttribute(EDIT_ATTRIBUTE)) {
      editButtonEl.setAttribute(EDIT_ATTRIBUTE, "true");
      editButtonEl.textContent = "Fertig";

      favoriteItemsActionButtons.forEach((button) => {
        button.classList.remove("delete-action--disabled");
      });
      applyDeleteFavoriteEventlistener();
    } else {
      editButtonEl.removeAttribute(EDIT_ATTRIBUTE);
      editButtonEl.textContent = "Bearbeiten";

      favoriteItemsActionButtons.forEach((button) => {
        button.classList.add("delete-action--disabled");
      });
    }
  });
}

function applyDeleteFavoriteEventlistener() {
  const favorites = getFavoritesFromLocalstorage();
  const deleteButtonEls = document.querySelectorAll(".delete-action__box");

  deleteButtonEls.forEach((button) => {
    button.addEventListener("click", () => {
      deleteFavoriteItem(favorites, button.getAttribute("data-name"));
      loadMainMenu();
    });
  });
}

function applySearchbarEventlistener() {
  const currentInputEl = document.querySelector(".main-menu__input");
  const debouncedSearch = debounce(renderSearchResults, 500);

  currentInputEl.addEventListener("focusin", () => {
    rootEl.removeEventListener("click", hideSearchResults);
    renderLoadingScreenSearchbar("Lade Vorschläge...");
    showSearchResults();
    renderSearchResults(currentInputEl.value);
  });

  currentInputEl.addEventListener("input", () =>
    debouncedSearch(currentInputEl.value),
  );
}

async function renderSearchResults(currentInput) {
  const searchResultsEl = document.querySelector(".main-menu__search-results");

  if (currentInput.length === 0) {
    searchResultsEl.innerHTML = "";
    return;
  }

  renderLoadingScreenSearchbar();

  const searchResultsData = await getSearchResults(currentInput);

  let html = "";

  searchResultsData.forEach((result) => {
    html += `
    <div class="search-result" data-id="${result.id}" data-name="${result.name}">
        <p class="search-result__city">${result.name}</p>
        <p class="search-result__country">${result.country}</p>
    </div>`;
  });

  searchResultsEl.innerHTML = html;

  applySearchResultsEventlistener();
}

function applySearchResultsEventlistener() {
  const searchResultsElements = document.querySelectorAll(".search-result");

  searchResultsElements.forEach((result) =>
    result.addEventListener("click", () => {
      const locationId = result.getAttribute("data-id");
      const locationName = result.getAttribute("data-name");
      loadDetailView(locationId, locationName);
    }),
  );

  rootEl.addEventListener("click", hideSearchResults);
}

export function hideSearchResults() {
  const searchResultsEl = document.querySelector(".main-menu__search-results");
  searchResultsEl.removeAttribute(SHOW_SEARCHRESULTS);
  handleVisibilitySearchResults(searchResultsEl);
}

function showSearchResults() {
  const searchResultsEl = document.querySelector(".main-menu__search-results");
  searchResultsEl.setAttribute(SHOW_SEARCHRESULTS, "true");
  handleVisibilitySearchResults(searchResultsEl);
}

function handleVisibilitySearchResults(searchResults) {
  if (searchResults.getAttribute(SHOW_SEARCHRESULTS)) {
    searchResults.classList.remove("main-menu__search-results--disabled");
  } else {
    searchResults.classList.add("main-menu__search-results--disabled");
  }
}
