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
 * Escape XML entities in a text/attribute value and strip the disallowed
 * C0 control characters and `DEL` covered by `ILLEGAL_XML_CHARS` (XML 1.0
 * §2.2). Surrogate halves and noncharacters such as U+FFFE/U+FFFF are
 * intentionally NOT filtered here. Safe for `<tag>VALUE</tag>` and
 * `attr="VALUE"` insertion.
 */
export function escapeXml(value: unknown): string {
    return String(value ?? '')
        .replace(ILLEGAL_XML_CHARS, '')
        .replace(/[&<>"']/g, ch => XML_ENTITIES[ch]);
}

/**
 * Convert an arbitrary string into a safe XML element name using a
 * conservative ASCII-only subset of XML naming rules.
 *
 * This helper allows names that start with `A-Z`, `a-z`, or `_`, followed
 * by zero or more `A-Z`, `a-z`, `0-9`, `_`, `.`, or `-` characters. Any
 * other character is replaced with `_`, including namespace separators
 * (`:`) and non-ASCII / Unicode name characters that the full XML 1.0
 * NameStartChar / NameChar productions would allow. An empty/invalid
 * result falls back to `_`.
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
