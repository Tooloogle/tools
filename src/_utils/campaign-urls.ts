export const UTM_FIELDS = ['source', 'medium', 'campaign', 'term', 'content', 'id'];
const CLICK_TRACKERS = new Set(['gclid', 'dclid', 'fbclid', 'msclkid', 'ttclid', 'twclid', 'igshid', 'mc_cid', 'mc_eid']);

export function parseWebUrl(input: string): URL {
    const url = new URL(input.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
        throw new Error('Enter an absolute HTTP or HTTPS URL without credentials.');
    }

    return url;
}

function parameterNames(url: URL): string[] {
    const names = new Set<string>();
    url.searchParams.forEach((_value, name) => names.add(name));
    return [...names];
}

export function readUtmFields(input: string): Record<string, string> {
    const url = parseWebUrl(input);
    const fields: Record<string, string> = {};
    for (const field of UTM_FIELDS) {
        const name = parameterNames(url).find(name => name.toLowerCase() === `utm_${field}`);
        fields[field] = name ? url.searchParams.get(name) ?? '' : '';
    }

    return fields;
}

export function buildUtmUrl(input: string, fields: Record<string, string>): string {
    const url = parseWebUrl(input);
    if (['source', 'medium', 'campaign'].some(field => !fields[field]?.trim())) {
        throw new Error('Enter a source, medium, and campaign.');
    }

    for (const name of parameterNames(url)) {
        if (UTM_FIELDS.some(field => name.toLowerCase() === `utm_${field}`)) {
            url.searchParams.delete(name);
        }
    }

    for (const field of UTM_FIELDS) {
        const value = fields[field]?.trim();
        if (value) {
            url.searchParams.set(`utm_${field}`, value);
        }
    }

    return url.href;
}

export interface CleanedUrl {
    url: string;
    removed: string[];
}

export function cleanTrackingUrl(input: string, extraTrackers = false): CleanedUrl {
    const url = parseWebUrl(input);
    const removed = parameterNames(url).filter(name => {
        const normalized = name.toLowerCase();
        return normalized.startsWith('utm_') || (extraTrackers && CLICK_TRACKERS.has(normalized));
    });
    for (const name of removed) {
        url.searchParams.delete(name);
    }

    return { url: removed.length ? url.href : input.trim(), removed };
}