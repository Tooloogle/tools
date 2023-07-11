export function getCurrentLocale(defaultLocale = "en-in"): string {
    if (typeof navigator === "undefined") {
        return defaultLocale;
    }

    if (navigator.language) {
        return navigator.language;
    }

    if (navigator.languages?.[0]) {
        return navigator.languages[0];
    }

    return defaultLocale;
}

export function getCurrentLang(defaultLocale = "en-in") {
    return getCurrentLocale(defaultLocale)?.split("-")[0] || "en";
}

export function getCurrentLocaleCountry(defaultLocale = "en-in") {
    const parts = getCurrentLocale(defaultLocale)?.split("-")
    return parts?.length ? parts[1] : "in";
}
