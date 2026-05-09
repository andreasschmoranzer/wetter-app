/* export function renderMainMenu() {
  displayMainMenu();
} */

export function displayMainMenu() {
  return `
  <div class="main-menu">
    <div class="navbar">
        <h1 class="navbar__heading">Wetter</h1>
        <p class="navbar__action">Bearbeiten</p>
    </div>
    <input
        class="main-menu__input"
        type="text"
        placeholder="Nach Stadt suchen..."
    />
    <div class="main-menu__favorites-list">
        <div class="favorite-item">
        <div class="favorite-item__action favorite-item__action--disabled">
            <div class="delete-action">
            <div class="delete-action__icon"></div>
            </div>
        </div>
        <div class="favorite-item__location-data">
            <div class="favorite-place__location-and-status">
            <div class="favorite-place__location-and-country">
                <p class="favorite-place__location">Samerberg</p>
                <p class="favorite-place__country">Germany</p>
            </div>
            <p class="favorite-place__current-status">Klar</p>
            </div>
            <div class="favorite-place__temperatures">
            <p class="favorite-place__current-temperature">10°</p>
            <div class="favorite-place__min-max-temperatures">
                <span class="favorite-place__max-temperature"> H: 18° </span>
                <span class="favorite-place__min-temperature"> T: 2° </span>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>`;
}
