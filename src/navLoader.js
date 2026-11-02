import { getIconData } from "./iconLoader.js";
import { getAllTags } from "./gameData.js";
import { filterExclusive, filterFeatured, filterIconsByTag, showAllGames } from "./filterGames.js";
import { capitalizeWords } from "./utils.js";

export async function loadNav() {
    const tags = await getAllTags();

    const discoverTab = document.getElementById("discover-container");
    const genreTab = document.getElementById("genre-container");

    tags.forEach(tag => {
        const nav = createNavLink(capitalizeWords(tag), tag);

        genreTab.appendChild(nav);
    });

    const allGamesNav = createNavLink("All Games");
    const exclusiveNav = createNavLink("Exclusive");
    const featuredNav = createNavLink("Featured");

    discoverTab.append(allGamesNav, exclusiveNav, featuredNav);
}

function createNavLink(name, filter = "") {
    const navLink = document.createElement("div");

    navLink.textContent = `▶ ${name}`;
    navLink.classList.add("nav-link");

    const icons = getIconData();
    
    switch(name) {
        case "All Games":
            navLink.addEventListener("click", () => showAllGames(icons));
            break;
        case "Exclusive":
            navLink.addEventListener("click", () => filterExclusive(icons));
            break;
        case "Featured":
            navLink.addEventListener("click", () => filterFeatured(icons));
            navLink.style.color = "#00ff00";
            break;
        default:
            navLink.addEventListener("click", () => filterIconsByTag(filter, icons));
            break;
    }

    return navLink;
}