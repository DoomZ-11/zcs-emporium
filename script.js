let categories = [];

let categoryElements = [];
let iconElements = [];

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

        loadSectionContainer("All Games");

        games.forEach((game) => {
            processGame(game);
        });

        createSections();
        createIcons();

        createNavLinks();
    });
}

function processGame(game) {
    game.tags.forEach((tag) => {
        if (!categories.includes(tag)) {
            loadSectionContainer(tag);
        }

        loadIcon(game, tag);
    });

    loadIcon(game, "All Games");
}

function loadSectionContainer(tag) {
    if (categories.includes(tag)) {
        return;
    }

    categories.push(tag);

    categories.sort();

    const label = document.createElement("div");

    label.textContent = capitalize(tag);
    label.className = "section-label unselectable";

    const categoryContainer = document.createElement("div");

    categoryContainer.className = "section-container";

    categoryElements.push({
        tag,
        label,
        container: categoryContainer
    });
}

function loadIcon(game, tag) {
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

    iconElements.push({
        game,
        gameCard,
        tag
    });
}

function createSections() {
    const iconsContainer = document.getElementById("icons-container");

    if (!iconsContainer) {
        console.warn(`Unable to find element id 'icons-container'`);
        return;
    }

    categoryElements.sort((a, b) => a.tag.localeCompare(b.tag));

    const allIndex = categoryElements.findIndex(category => category.tag === "All Games");

    if (allIndex !== -1) {
        categoryElements.push(categoryElements.splice(allIndex, 1)[0]);
    }

    const featuredIndex = categoryElements.findIndex(category => category.tag === "featured");

    if (featuredIndex !== -1) {
        const [element] = categoryElements.splice(featuredIndex, 1);

        categoryElements.unshift(element);
    }

    categoryElements
        .forEach(section => {
            iconsContainer.append(section.label);
            iconsContainer.append(section.container);
        });
}

function createIcons() {
    iconElements
        .forEach((icon) => {
            const category = categoryElements.find(category => category.tag === icon.tag);

            if (!category) {
                console.warn(`No category found for tag "${icon.tag}"`);
                return;
            }

            category.container.append(icon.gameCard);
        });
}

function createNavLinks() {
    const navContainer = document.getElementById("nav-container");

    let i = 0;
    categoryElements.forEach((category) => {
        const nav = document.createElement("div");

        nav.textContent = ` > ${capitalize(category.tag)} (${category.container.children.length})`;
        nav.className = "nav-link unselectable";

        if (category.tag === "featured") {
            nav.style.color = `#00ff00`;
        }

        nav.addEventListener("click", () => {
            category.label.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        })

        navContainer.append(nav);

        i++;
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

    tagsDisplay.textContent = `Tags: `;

    game.tags.forEach((tag, index) => {
        tagsDisplay.textContent += `${capitalize(tag)}`;

        if (index !== game.tags.length - 1) {
            tagsDisplay.textContent += `, `;
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

    return games.filter(game => game.demo);
}

function initalizeSearchBar() {
    const searchBar = document.getElementById("search-bar");

    searchBar.addEventListener(("input"), (event) => {
        filterGames(event.target.value);
    });
}

function filterGames(search) {
    categoryElements.forEach(category => {
        if (category.tag === "All Games") {
            category.label.scrollIntoView({
                behavior: "instant"
            });
        }
    });

    setAllGamesLabel(search);

    search = search.trim().toLowerCase();

    if (search !== "") {
        showOnlyAllGames();
    }
    else {
        showAllCategories();
    }

    iconElements.forEach(icon => {
        const matches = 
            search === "" ||
            icon.game.title.toLowerCase().includes(search) ||
            icon.game.tags.some(tag =>
                tag.toLowerCase().includes(search));

        icon.gameCard.style.display = matches ? "" : "none";
    });
}

function setAllGamesLabel(search) {
    categoryElements.forEach(category => {
        if (category.tag === "All Games") {
            category.label.textContent = search !== "" ? `Showing results for: '${search}'` : "All Games";
        }
    });
}

function showOnlyAllGames() {
    categoryElements.forEach(category => {
        const visible = category.tag === "All Games";

        category.label.style.display = visible ? "" : "none";
        category.container.style.display = visible ? "" : "none";
    });
}

function showAllCategories() {
    categoryElements.forEach(category => {
        category.label.style.display = "";
        category.container.style.display = "";
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
            else if (totalFocusMessagesShown < 3) {
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