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

// XML 1.0 forbids most C0 control characters in element/attribute text.
// Only \t (0x09), \n (0x0A), and \r (0x0D) are legal; everything else in
// 0x00-0x1F (and the lone 0x7F DEL) must be stripped.
// eslint-disable-next-line no-control-regex
const ILLEGAL_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Escape XML entities in a text/attribute value and strip characters that
 * are illegal under XML 1.0. Safe for `<tag>VALUE</tag>` and
 * `attr="VALUE"` insertion.
 */
export function escapeXml(value: unknown): string {
    return String(value ?? '')
        .replace(ILLEGAL_XML_CHARS, '')
        .replace(/[&<>"']/g, ch => XML_ENTITIES[ch]);
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
