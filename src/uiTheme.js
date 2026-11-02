const themes = [
    { color: "#004059", name: "Ocean Blue" },
    { color: "#00065a", name: "Navy Blue" },
    { color: "#3e0044", name: "Mystic Purple" },
    { color: "#005932", name: "Emerald Green" },
    { color: "#590000", name: "Crimson Red" },
    { color: "#5c4004", name: "Burnished Orange" },
    { color: "#404040", name: "Titanium Grey" },
    { color: "#202020", name: "Phantom Grey" },
    { color: "#000000", name: "Abyss Black" }
];

let currentTheme = Number(
    localStorage.getItem("themeIndex")
);

if (
    !Number.isInteger(currentTheme) ||
    currentTheme < 0 ||
    currentTheme >= themes.length
) {
    currentTheme = 0;
}

export function initalizeThemeButton() {
    const themeButton = document.getElementById("theme-cycle-button");
    const themeText = document.getElementById("theme-cycle-text");

    themeButton.addEventListener("click", () => cycleTheme());
    themeText.addEventListener("click", () => cycleTheme());

    setTheme(currentTheme);
}

export function cycleTheme() {
    currentTheme = (currentTheme + 1) % themes.length;

    setTheme(currentTheme);
}

export function setTheme(index) {
    if (
        !Number.isInteger(index) ||
        index < 0 || 
        index >= themes.length
    ) return;

    currentTheme = index;

    localStorage.setItem("themeIndex", index);

    const primary = themes[index].color;
    const secondary = darkenColor(primary, 0.5);

    document.documentElement.style.setProperty(
        "--primary", primary
    );

    document.documentElement.style.setProperty(
        "--secondary", secondary
    );

    updateThemeUI(index);
}

function updateThemeUI(index) {
    const themeLabel = document.getElementById("theme-cycle-label");

    themeLabel.textContent = themes[index].name;

    themeLabel.classList.remove("pulse-scale");

    void themeLabel.offsetWidth;

    themeLabel.classList.add("pulse-scale");

    const themeButton = document.getElementById("theme-cycle-button"); 

    themeButton.classList.remove("theme-button-shake");

    void themeButton.offsetWidth;

    themeButton.classList.add("theme-button-shake");
}

function darkenColor(hex, amount) {
    const value = hex.replace("#", "");

    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);

    const darken = channel =>
        Math.round(channel * (1 - amount));

    return `#${[r, g, b]
        .map(channel => darken(channel)
            .toString(16)
            .padStart(2, "0"))
        .join("")}`;
}