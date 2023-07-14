export function isBrowser() {
    return typeof window !== "undefined";
}

export function hasClipboard() {
    return typeof navigator !== "undefined" && navigator.clipboard !== undefined;
}
