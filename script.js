const BASE_URL = "https://cdn.jsdelivr.net/gh/DoomZ-11/zcs-emporium@4f81186/";

function loadGames() {
    fetch(BASE_URL + 'game-data.json')
    .then(res => res.json())
    .then(games => {
        games.sort((a, b) => a.file.localeCompare(b.file));

        const allGamesContainer = document.getElementById('all-games');
        const featuredGamesContainer = document.getElementById('featured-games');

        if (!allGamesContainer || !featuredGamesContainer) return;

        games.forEach(game => {
            createIcon(game, allGamesContainer);
            if (game.featured == true) {
                createIcon(game, featuredGamesContainer);
            }
        });
    });
}

function createIcon(game, container) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.title = game.title;

    if (game.openblank == false) {
        icon.innerHTML = `
            <img src="${BASE_URL}${game.icon}">
            <div class="game-title">${game.title}</div>
        `;

        icon.onclick = () => {
            openGameOverlay(BASE_URL + game.file, game.title);
        };
    }
    else {
        icon.innerHTML = `
            <img src="${BASE_URL}${game.icon}">
            <div class="game-title">✴ ${game.title}</div>
        `;

        icon.onclick = () => {
            openBlankURL(BASE_URL + game.file);
        };
    }

    container.appendChild(icon);
}

function openGameOverlay(url, title) {
    const overlay = document.getElementById("game-overlay");
    const frame = document.getElementById("game-frame");
    const gameTitle = document.getElementById("overlay-title");

    gameTitle.textContent = title;
    fetch(url)
    .then(res => res.text())
    .then(html => {
        const blob = new Blob([html], { type: "text/html" });
        const blobURL = URL.createObjectURL(blob);

        const frame = document.getElementById("game-frame");
        frame.src = blobURL;

        document.getElementById("game-overlay").classList.remove("hidden");
    });

    overlay.classList.remove("hidden");
}

function closeGameOverlay() {
    const overlay = document.getElementById("game-overlay");
    const frame = document.getElementById("game-frame");
    const gameTitle = document.getElementById("overlay-title");

    gameTitle.textContent = "Select a Game!";
    frame.src = "";

    overlay.classList.add("hidden");
}

function openBlankURL(file) {
    const tab = window.open("about:blank", "_blank");

    fetch(file)
    .then(res => res.text())
    .then(html => {
        tab.document.open();
        tab.document.write(html);

        tab.addEventListener('beforeunload', function (event) {
            event.preventDefault();
            event.returnValue = ''; 
        });

        tab.document.close();
    })
    .catch (err => console.error(err));
}

function loadFullscreen() {
    const frame = document.getElementById('game-frame')

    if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    } else if (frame.msRequestFullscreen) {
        frame.msRequestFullscreen();
    }
}

function initializeSearchBar() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;

    searchBar.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        event.preventDefault();

        const query = this.value.toLowerCase().trim();
        if (!query) return;

        const icons = document.querySelectorAll(".icon");

        for (let icon of icons) {
            const name = icon.title.toLowerCase();

            if (name.includes(query)) {
                icon.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                icon.classList.add("search-highlight");

                icon.addEventListener("mouseenter", () => {
                    icon.classList.remove("search-highlight");
                });

                searchBar.value = '';

                break;
            }
        }
    });
}

function loopWelcomeASCII() {
    const LINES_PER_FRAME = 57;
    const FPS = 12.5;
    fetch(BASE_URL + 'welcome-ascii.txt')
    .then(res => res.text())
    .then(text => {
        const target = document.getElementById('welcome-ascii');
        if (!target) return;

        const lines = text.split('\n');
        let frames = [];
        for (let i = 0; i < lines.length; i += LINES_PER_FRAME) {
            frames.push(lines.slice(i, i + LINES_PER_FRAME).join('\n'));
        }

        let curFrame = 0;
        setInterval(() => {
            target.textContent = frames[curFrame];
            curFrame = (curFrame + 1) % frames.length;
        }, 1000 / FPS);
    })
    .catch(err => console.error(err));
}

function main() {
    loopWelcomeASCII();

    loadGames();
    initializeSearchBar();

    window.addEventListener('beforeunload', function (event) {
        event.preventDefault();
        event.returnValue = ''; 
    });
}

document.addEventListener('DOMContentLoaded', main);
