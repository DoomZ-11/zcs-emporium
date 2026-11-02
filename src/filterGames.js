import { capitalizeWords, normalizeString } from "./utils.js";

export function filterIconsByTag(tag, icons) {
    icons.forEach(icon => {
        const matches = icon.game.tags.includes(tag);

        icon.icon.classList.toggle("hidden", !matches);

        resetScroll();
    });

    updateLibraryHeader(capitalizeWords(tag));
}

export function filterIconsBySearch(query, icons) {
    const search = normalizeString(query);

    icons.forEach(icon => {
        const matches = normalizeString(icon.game.title).includes(search);

        icon.icon.classList.toggle("hidden", !matches);
    });

    const searchStr = `Showing results for '${query}'`;

    updateLibraryHeader(searchStr);
    resetScroll();
}

export function filterExclusive(icons) {
    icons.forEach(icon => {
        const matches = icon.game.isExclusive;

        icon.icon.classList.toggle("hidden", !matches);

        updateLibraryHeader("ZC's Exclusives")
        resetScroll();
    });
}

export function filterFeatured(icons) {
    icons.forEach(icon => {
        const matches = icon.game.isFeatured;

        icon.icon.classList.toggle("hidden", !matches);
    });

    updateLibraryHeader("Featured");
    resetScroll();
}

export function showAllGames(icons) {
    icons.forEach(icon => icon.icon.classList.remove("hidden"));

    updateLibraryHeader("All Games");
    resetScroll();
}

function updateLibraryHeader(str) {
    const libraryHeader = document.getElementById("library-header");

    libraryHeader.textContent = str;
}

function resetScroll() {
    const libraryHeader = document.getElementById("library-header");

    libraryHeader.scrollIntoView();
}