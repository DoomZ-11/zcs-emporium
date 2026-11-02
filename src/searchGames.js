import { filterIconsBySearch, showAllGames } from "./filterGames.js";
import { normalizeString } from "./utils.js";
import { getIconData } from "./iconLoader.js";

export function initalizeSearchBar() {
    const searchBar = document.getElementById("search-bar");

    searchBar.addEventListener("input", () => {
        const search = normalizeString(searchBar.value);

        if (search !== "") {
            filterIconsBySearch(search, getIconData());
        } else {
            showAllGames(getIconData());
        }
    });
}