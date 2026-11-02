const ANIMATION_TIME = 250;

export function showOverlay() {
    const overlay = document.getElementById("back-overlay");

    overlay.classList.remove("hidden");

    overlay.classList.remove("overlay-fade-out");
    overlay.classList.add("overlay-fade-in");
}

export function hideOverlay() {
    const overlay = document.getElementById("back-overlay");

    overlay.classList.remove("overlay-fade-in");
    overlay.classList.add("overlay-fade-out");

    setTimeout(() => {
        overlay.classList.add("hidden");
    }, ANIMATION_TIME);
}