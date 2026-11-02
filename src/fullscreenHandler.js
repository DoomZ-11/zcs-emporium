export function initalizeFullscreenListeners() {
    const isOnMainSite =
        location.hostname === "doomz-11.github.io" ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";

    if (isOnMainSite) return;

    const requestFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    };

    document.addEventListener("click", requestFullscreen);

    document.querySelectorAll("iframe").forEach((iframe) => {
        iframe.addEventListener("load", () => { 
            iframe.contentDocument.addEventListener("click", requestFullscreen);
        });
    });
}