let iconData = [];
let globalTags = [];

let startWindowOpen = false;

let currentSelectedGame = null;
let gameZoom = 1;

let curDemoShift = 0;

let totalFocusMessagesShown = 1;

function initializeUI() {
    fetch('game-data.json')
    .then(res => res.json())
    .then((games) => {
        games.sort((a, b) => a.title.localeCompare(b.title));

        loadLibraryLabel();

        games.forEach((game) => getIconData(game));
        
        createIcons();

        createNavLinks();
    });
}

function loadLibraryLabel() {
    const libraryContainer = document.getElementById("library-container");

    if (!libraryContainer) {
        console.warn(`Unable to find element by id 'library-container'`);
        return;
    }

    const label = document.createElement("div");
    label.classList.add("section-label");
    label.classList.add("unselectable");
    label.id = "library-label";

    label.textContent = "All Games";

    libraryContainer.prepend(label);
}

function getIconData(game) {
    game.tags.forEach((tag) => {
        if (!globalTags.includes(tag)) {
            globalTags.push(tag);
        }
    })

    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    
    const icon = document.createElement("div");
    icon.className = "game-icon";

    const image = document.createElement("div");
    image.className = "game-image";
    image.style.backgroundImage = `url('${game.icon}')`;

    icon.append(image);

    gameCard.append(icon);

    const title = document.createElement("div");
    title.textContent = game.title;
    title.className = "game-title unselectable";

    gameCard.append(title);

    icon.addEventListener("click", () => {
        openStartWindow(game);
    });

    iconData.push({
        game,
        gameCard
    });
}

function createIcons() {
    const iconContainer = document.getElementById("icon-container");

    iconData
    .forEach((icon) => {
        iconContainer.append(icon.gameCard);
    });
}

function createNavLinks() {
    const discoveryContainer = document.getElementById("discovery-container");

    const allGamesNav = document.createElement("div");
    allGamesNav.classList.add("nav-link");
    allGamesNav.classList.add("unselectable");

    allGamesNav.textContent = "▶ All Games";
    
    allGamesNav.addEventListener("click", () => {
        filterGames("", true);
    });

    const featuredNav = document.createElement("div");
    featuredNav.classList.add("nav-link");
    featuredNav.classList.add("unselectable");

    featuredNav.textContent = "▶ Featured";
    featuredNav.style.color = "#ffff00";

    featuredNav.addEventListener("click", () => {
        filterFeaturedGames();
    });

    discoveryContainer.append(allGamesNav);
    discoveryContainer.append(featuredNav);

    globalTags.sort((a, b) => a.localeCompare(b));

    const genreContainer = document.getElementById("genre-container");

    globalTags.forEach((tag) => {
        const nav = document.createElement("div");

        nav.textContent = `▶ ${capitalize(tag)}`;
        nav.className = "nav-link unselectable";

        nav.addEventListener("click", () => {
            filterGames(capitalize(tag), false);
        })

        genreContainer.append(nav);
    });
}

async function launchGame() {
    closeStartWindow();

    resetGameZoom();
    hideScrollbar();

    if (!currentSelectedGame) return;

    const toolbar = document.getElementById("toolbar");
    const toolbarTitle = document.getElementById("game-toolbar-title");

    const gameFrameContainer = document.getElementById("game-frame-container");

    gameFrameContainer.classList.remove("hidden");
    toolbar.classList.remove("hidden");

    toolbarTitle.textContent = currentSelectedGame.title;

    const frame = document.getElementById("game-frame");

    const html = await fetch(currentSelectedGame.file).then(r => r.text());

    const doc = frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
}

function openInNewTab() {
    closeStartWindow();

    if (!currentSelectedGame) return;

    const tab = window.open("about:blank", "_blank");

    fetch(currentSelectedGame.file)
        .then(response => response.text())
        .then(html => {
            tab.document.open();
            tab.document.write(html);
            tab.document.close();
        });
}

function openInWindow() {
    window.open(
        currentSelectedGame.file,
        "_blank",
        "width=800,height=600,resizable=yes"
    );
}

function closeGame() {
    showScrollbar();

    const toolBar = document.getElementById("toolbar");

    const gameFrameContainer = document.getElementById("game-frame-container");
    const gameFrame = document.getElementById("game-frame");

    toolBar.classList.add("hidden");
    gameFrameContainer.classList.add("hidden");

    gameFrame.src = ``;
}

function openStartWindow(game) {
    currentSelectedGame = game;

    const darkOverlay = document.getElementById("dark-overlay");
    darkOverlay.classList.remove("hidden");

    darkOverlay.classList.remove("fade-out");
    darkOverlay.classList.add("fade-in");

    const startWindow = document.getElementById("game-start-window");
    startWindow.classList.remove("hidden");

    startWindow.classList.remove("y-scale-disappear");
    startWindow.classList.add("y-scale-appear");

    const previewIcon = document.getElementById("start-window-icon");
    previewIcon.style.backgroundImage = `url('${game.icon}')`;

    const tagsDisplay = document.getElementById("start-window-tags");
    tagsDisplay.textContent = "";

    game.tags.forEach((tag, index) => {
        tagsDisplay.textContent += `${capitalize(tag)}`;

        if (index !== game.tags.length - 1) {
            tagsDisplay.textContent += ` • `;
        }
    });

    setTimeout(() => {
        startWindowOpen = true;
    }, 250);
}

function closeStartWindow() {
    startWindowOpen = false;
    
    const darkOverlay = document.getElementById("dark-overlay");

    darkOverlay.classList.remove("fade-in");
    darkOverlay.classList.add("fade-out");

    const startWindow = document.getElementById("game-start-window");

    startWindow.classList.remove("y-scale-appear");
    startWindow.classList.add("y-scale-disappear");

    setTimeout(() => {
        darkOverlay.classList.add("hidden");
        startWindow.classList.add("hidden");
    }, 250);
}

function updateWelcomeText(tarText){
    const delay = 200;
	const text = document.getElementById('welcome');

    text.innerHTML = tarText
        .split("")
        .map(letter => {
            return `<span>` + letter + `</span>`;
        })
        .join("");

    Array.from(text.children).forEach((span, index) => {
        span.classList.add('welcome-anim');
        span.classList.add('unselectable');
        span.style.animationDelay = `${-index * 0.06}s`;
    });

}

async function handleDemos() {
    const demoGames = await getGamesWithDemos();

    const container = document.getElementById("demo-container");

    demoGames.forEach(game => {
        const video = document.createElement("video");

        video.className = "demo-box";

        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";

        video.src = game.demo;

        container.append(video);

        video.load();
    });

    scaleMiddle();

    const firstVideo = document.querySelector(".demo-box");

    demoWidth = firstVideo.offsetWidth;

    setInterval(() => scrollDemos(), 5000);
}

function scrollDemos() {
    const container = document.getElementById("demo-container");

    container.style.transform =
        `translateX(${demoWidth + 32}px)`;

    resetDemoScales();

    setTimeout(() => {
        container.style.transition = "none";

        container.prepend(container.lastElementChild);

        container.style.transform = "translateX(0)";
        container.offsetHeight;

        scaleMiddle();
        
        container.style.transition =
            "transform 0.5s ease-out";
    }, 500);
}

function scaleMiddle() {
    const container = document.getElementById("demo-container");
    const demos = [...container.children];

    const middle = demos[Math.floor(demos.length / 2)];

    middle.style.transform = "scale(1.2)";
    middle.style.zIndex = "2";
}

function resetDemoScales() {
    const container = document.getElementById("demo-container");
    const demos = [...container.children];

    demos.forEach(demo => {
        demo.style.transform = "scale(1)";
        demo.style.zIndex = "1";
    });
}

async function getGamesWithDemos() {
    const res = await fetch('game-data.json');
    const games = await res.json();

    return games.filter((game) => game.demo);
}

function initalizeSearchBar() {
    const searchBar = document.getElementById("search-bar");

    searchBar.addEventListener(("input"), (event) => {
        filterGames(event.target.value, true);
    });
}

function filterGames(search, isSearch) {
    setLibraryLabel(search, isSearch);

    search = search.trim().toLowerCase();

    iconData.forEach((icon) => {
        const matches = 
            search === "" ||
            icon.game.title.toLowerCase().includes(search) ||
            icon.game.tags.some((tag) =>
                tag.toLowerCase().includes(search));

        icon.gameCard.style.display = matches ? "" : "none";
    });

    scrollToTopOfGames();
}

function filterFeaturedGames() {
    setLibraryLabel("Featured", false);

    iconData.forEach((icon) => {
        icon.gameCard.style.display = icon.game.isFeatured ? "" : "none";
    });

    scrollToTopOfGames();
}

function setLibraryLabel(filter, isSearch) {
    const libraryLabel = document.getElementById("library-label");

    if (isSearch) {
        libraryLabel.textContent = filter !== "" ? `Showing results for: '${filter}'` : "All Games";
    } else {
        libraryLabel.textContent = filter;
    }
    
}

function scrollToTopOfGames() {
    const libraryLabel = document.getElementById("library-label");

    libraryLabel.scrollIntoView({ 
        behavior: "auto", 
        block: "start"
    });
}

function toggleFullscreen() {
    const frame = document.getElementById("game-frame");

    frame.requestFullscreen();
}

function applyGameZoom() {
    const iframe = document.getElementById("game-frame");

    if (!iframe.contentDocument) return;

    iframe.contentDocument.body.style.zoom = gameZoom;
}

function zoomGameIn() {
    gameZoom += 0.05;
    applyGameZoom();
}

function zoomGameOut() {
    gameZoom = Math.max(0.05, gameZoom - 0.05);
    applyGameZoom();
}

function resetGameZoom() {
    gameZoom = 1;
    applyGameZoom();
}

function setGlobalEventListeners() {
    const startWindow = document.getElementById("game-start-window");
    const focusWindow = document.getElementById("click-to-focus");

    const isOnMainSite =
        location.href.startsWith("https://doomz-11.github.io/zcs-emporium/");

    document.addEventListener("click", (event) => {
        if (!document.fullscreenElement && !isOnMainSite) {
            document.documentElement.requestFullscreen();
        }

        if (!startWindow.contains(event.target) && startWindowOpen) {
            closeStartWindow();
        }
    });

    if (!isOnMainSite) {
        focusWindow.classList.remove("hidden");

        document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
                focusWindow.classList.add("hidden");
            }
            else if (totalFocusMessagesShown < 5) {
                focusWindow.classList.remove("hidden");
                totalFocusMessagesShown++;
            }
        });
    }

    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = "";
    });
}

function showScrollbar() {
    document.documentElement.classList.remove("hide-scrollbar");
    document.body.classList.remove("hide-scrollbar");
}

function hideScrollbar() {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function main() {
    console.log("DOM Successfully loaded!");

    initializeUI();
    initalizeSearchBar();

    updateWelcomeText(`Welcome to the Emporium!`);

    //handleDemos();

    setGlobalEventListeners();
}

document.addEventListener("DOMContentLoaded", main);
