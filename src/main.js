import "../styles/styles.scss";
import { loadMainMenu } from "./mainMenu";

export const rootEl = document.getElementById("app");

export const LOCALSTORAGE_KEY = "favorites";
export const SHOW_SEARCHRESULTS = "show-search-data";

export const API_BASE_URL = "https://api.weatherapi.com/v1";
export const API_KEY = "a52a3c13c4f94a06810125930262404";

loadMainMenu();
