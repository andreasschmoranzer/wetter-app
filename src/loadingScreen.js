import { rootEl } from "./main";

export function renderLoadingScreen(message = "Lade ...") {
  rootEl.innerHTML = displayLoadingScreen(message);
}

function displayLoadingScreen(message) {
  return `
    <div class="loadingScreen">
        <div class="loadingScreen__description">${message}</div>
        <div class="loadingScreen__spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    `;
}

export function renderLoadingScreenSearchbar(message = "Lade Vorschläge...") {
  const searchResultsEl = document.querySelector(".main-menu__search-results");
  searchResultsEl.innerHTML = `<p class="search-result search-result__city">${message}</p>`;
}
