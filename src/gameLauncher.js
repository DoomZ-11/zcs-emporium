import { showOverlay, hideOverlay } from "./backOverlay.js";
import { capitalizeWords } from "./utils.js";

const ANIMATION_DURATION = 250;

let curGame = null;

let launcherOpen = false;

let currentZoom = 1
let zoomMagnitude = 0.1;

export function initializeGameLauncher() {
    const closeLauncherButton = document.getElementById("launcher-close-button");

    closeLauncherButton.addEventListener("click", closeLauncherWindow);

    const launchButton = document.getElementById("launcher-launch-button");

    launchButton.addEventListener("click", launchCurrentGame);

    const newTabButton = document.getElementById("launcher-newtab");
    
    newTabButton.addEventListener("click", openInNewTab);

    const newWindowButton = document.getElementById("launcher-newwindow");

    newWindowButton.addEventListener("click", openInWindow);

    const closeButton = document.getElementById("player-close-button");

    closeButton.addEventListener("click", closeCurrentGame);
    
    const fullscreenButton = document.getElementById("player-fullscreen-button");

    fullscreenButton.addEventListener("click", requestGameFullscreen);

    const zoomOutButton = document.getElementById("player-zoom-out-button");
    
    zoomOutButton.addEventListener("click", playerZoomOut);

    const zoomInButton = document.getElementById("player-zoom-in-button");

    zoomInButton.addEventListener("click", playerZoomIn);

    const launcherWindow = document.getElementById("launcher-window");

    document.addEventListener("click", (event) => {
        if (!launcherWindow.contains(event.target) && launcherOpen) {
            closeLauncherWindow();
        }
    });
}

export function setCurrentGame(game) {
    curGame = game;
}

export function openLauncherWindow() {
    if (launcherOpen || curGame === null) return;

    showOverlay();
    launcherOpenAnimation();

    setLauncherTitle(curGame.title);
    setPreviewIcon(`${document.baseURI}icons/${curGame.icon}`);
    setTagsDisplay(curGame.tags);

    resetPlayerZoom();

    setTimeout(() => {
        launcherOpen = true;
    }, ANIMATION_DURATION);
}

export function closeLauncherWindow() {
    hideOverlay();
    launcherCloseAnimation();

    setTimeout(() => {
        launcherOpen = false;
    }, ANIMATION_DURATION);
}

function launcherOpenAnimation() {
    const launcherWindow = document.getElementById("launcher-window");

    launcherWindow.classList.remove("hidden");

    launcherWindow.classList.remove("launcher-close");
    launcherWindow.classList.remove("launcher-open");

    launcherWindow.offsetWidth;

    launcherWindow.classList.add("launcher-open");
}

function launcherCloseAnimation() {
    const launcherWindow = document.getElementById("launcher-window");

    launcherWindow.classList.remove("launcher-open");
    launcherWindow.classList.remove("launcher-close");

    launcherWindow.offsetWidth;

    launcherWindow.classList.add("launcher-close");

    setTimeout(() => {
        launcherWindow.classList.add("hidden");
    }, 250);
}

function setTagsDisplay(tags) {
    const tagsText = document.getElementById("launcher-tags");

    tagsText.textContent = "";

    tags.forEach((tag, index) => {
        tagsText.textContent += `${capitalizeWords(tag)}`;

        if (index !== tags.length - 1) {
            tagsText.textContent += ` • `;
        }
    });
}

function setLauncherTitle(title) {
    const launcherTitle = document.getElementById("launcher-title");

    launcherTitle.textContent = title;
}

function setPreviewIcon(icon) {
    const previewIcon = document.getElementById("launcher-icon");

    previewIcon.src = icon;
}

function setPlayerTitle(title) {
    const playerTitle = document.getElementById("player-game-title");

    playerTitle.textContent = title;
}

export function launchCurrentGame() {
    if (curGame === null) return;

    setPlayerTitle(curGame.title);

    const playerContainer = document.getElementById("player-container");

    playerContainer.classList.remove("hidden");

    const launcherWindow = document.getElementById("launcher-window");

    launcherWindow.classList.add("hidden");

    launcherOpen = false;

    const gameFrame = document.getElementById("game-frame");

    gameFrame.src = `${document.baseURI}games/${curGame.file}`;
}

export function closeCurrentGame() {
    const playerContainer = document.getElementById("player-container");

    playerContainer.classList.add("hidden");

    const gameFrame = document.getElementById("game-frame");

    gameFrame.src = "";

    hideOverlay();
}

export function openInNewTab() {
    closeLauncherWindow();

    if (curGame === null) return;

    const tab = window.open("about:blank", "_blank");

    fetch(`${document.baseURI}games/${curGame.file}`)
        .then(response => response.text())
        .then(html => {
            tab.document.open();
            tab.document.write(html);
            tab.document.close();

            tab.addEventListener("beforeunload", (event) => {
                event.preventDefault();
                event.returnValue = "";
            });
        });
}

export function openInWindow() {
    closeLauncherWindow();

    if (curGame === null) return;

    const gameWindow = window.open(
        `${document.baseURI}games/${curGame.file}`,
        "_blank",
        "width=800,height=600,resizable=yes"
    );

    if (!gameWindow) return;

    gameWindow.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = "";
    });
}

export function requestGameFullscreen() {
    const gameFrame = document.getElementById("game-frame");

    gameFrame.requestFullscreen();
}

export function playerZoomOut() {
    currentZoom -= zoomMagnitude;

    applyPlayerZoom();
}

export function playerZoomIn() {
    currentZoom += zoomMagnitude;

    applyPlayerZoom();
}

export function resetPlayerZoom() {
    currentZoom = 1;

    applyPlayerZoom();
}

export function applyPlayerZoom() {
    const gameFrame = document.getElementById("game-frame");

    if (!gameFrame.contentDocument) return;

    gameFrame.contentDocument.body.style.zoom = currentZoom;
}