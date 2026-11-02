import { getGames } from "./gameData.js";
import { openLauncherWindow, setCurrentGame } from "./gameLauncher.js";

let iconData = [];

export async function loadIcons() {
    iconData = await createIcons();

    appendIcons(iconData);
}

async function createIcons() {
    const icons = [];

    const games = await getGames();

    games.forEach(game => {
        const icon = createIcon(game);

        icons.push({
            game: game,
            icon: icon
        });
    });

    return icons;
}

function appendIcons(icons) {
    const iconContainer = document.getElementById("icon-container");

    icons.forEach(data => {
        iconContainer.appendChild(data.icon);
    });
}

function createIcon(game) {
    const icon = document.createElement("div");

    icon.classList.add("icon-card");

    const imageContainer = document.createElement("div");

    imageContainer.classList.add("icon-image-container");

    const image = document.createElement("img");

    image.src = image.src = new URL(`../icons/${game.icon}`, import.meta.url).href;
    image.alt = game.title;
    image.loading = "lazy";
    image.classList.add("icon-image");

    imageContainer.append(image);

    const title = document.createElement("span");

    title.textContent = game.title;
    title.classList.add("icon-title");

    icon.append(imageContainer, title);

    icon.addEventListener("click", () => {
        setCurrentGame(game);
        openLauncherWindow();
    });

    return icon;
}

export function getIconData() {
    return iconData;
}