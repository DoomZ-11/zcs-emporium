import { loadIcons } from "./iconLoader.js";
import { loadNav } from "./navLoader.js";
import { initalizeSearchBar } from "./searchGames.js";
import { initalizeThemeButton } from "./uiTheme.js";
import { initializeGameLauncher } from "./gameLauncher.js";
import { initalizeFullscreenListeners } from "./fullscreenHandler.js";

function main() {
    console.log("DOM Successfully loaded!");

    loadIcons();
    loadNav();

    initalizeSearchBar();
    initalizeThemeButton();
    initializeGameLauncher();
    initalizeFullscreenListeners();
    
    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = "";
    });
}

document.addEventListener("DOMContentLoaded", main);