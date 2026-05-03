import { rootEl } from "./main";

export function renderLoadingScreen(message = "Lade ...") {
  rootEl.innerHTML = displayLoadingScreen(message);
}

function displayLoadingScreen(message) {
  return `
    <div class="loadingScreen">
        <div class="lds__description">${message}</div>
        <div class="lds__spinner">
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
