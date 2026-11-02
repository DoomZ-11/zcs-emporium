export async function getGames() {
    const url = new URL("./data/gameData.json", import.meta.url);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to load games: ${res.status}`);
    }

    const games = await res.json();

    return games.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getAllTags() {
    const games = await getGames();

    return [...new Set(
        games.flatMap(game => game.tags)
    )].sort((a, b) => a.localeCompare(b, undefined, {
        sensitivity: "base",
        numeric: true
    }));
}