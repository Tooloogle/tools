/**
 * Helpers for safely emitting XML from arbitrary input.
 */

const XML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
};

/**
 * Escape XML entities in a text/attribute value. Leaves all other characters
 * untouched. Safe for `<tag>VALUE</tag>` and `attr="VALUE"` insertion.
 */
export function escapeXml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, ch => XML_ENTITIES[ch]);
}

/**
 * Convert an arbitrary string into a valid XML element name.
 *
 * XML names must start with a letter or underscore, and may contain
 * letters, digits, hyphens, underscores, or periods. Anything else is
 * replaced with `_`. An empty/invalid result falls back to `_`.
 */
export function sanitizeXmlName(name: string): string {
    if (!name) {
        return '_';
    }

    let safe = name.replace(/[^A-Za-z0-9_.-]/g, '_');

    // Element names cannot start with a digit, hyphen, or period.
    if (!/^[A-Za-z_]/.test(safe)) {
        safe = `_${safe}`;
    }

    return safe;
}
