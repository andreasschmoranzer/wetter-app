import "../styles/styles.scss";
import { loadMainMenu } from "./mainMenu";

export const rootEl = document.getElementById("app");

export const LOCALSTORAGE_KEY = "favorites";
export const SHOW_SEARCHRESULTS = "show-search-data";

loadMainMenu();
