export function capitalizeWords(str = "") {
    return str
        .toLowerCase()
        .replace(/(^|\s|\()([a-z])/g, (_, separator, letter) =>
            separator + letter.toUpperCase()
        );
}

export function normalizeString(str) {
    return str.trim().toLowerCase();
}