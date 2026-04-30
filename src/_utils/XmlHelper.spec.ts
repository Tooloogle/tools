import { escapeXml, sanitizeXmlName } from './XmlHelper.js';

describe('XmlHelper', () => {
    describe('escapeXml', () => {
        it('escapes the five XML entities', () => {
            expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
            expect(escapeXml('a < b')).toBe('a &lt; b');
            expect(escapeXml('a > b')).toBe('a &gt; b');
            expect(escapeXml('say "hi"')).toBe('say &quot;hi&quot;');
            expect(escapeXml("it's ok")).toBe('it&apos;s ok');
        });

        it('escapes all entities in one pass', () => {
            expect(escapeXml(`<tag attr="x" alt='y'>a & b</tag>`))
                .toBe('&lt;tag attr=&quot;x&quot; alt=&apos;y&apos;&gt;a &amp; b&lt;/tag&gt;');
        });

        it('coerces non-string values', () => {
            expect(escapeXml(42)).toBe('42');
            expect(escapeXml(true)).toBe('true');
            expect(escapeXml(null)).toBe('');
            expect(escapeXml(undefined)).toBe('');
        });

        it('strips illegal XML 1.0 control characters but keeps \\t, \\n, \\r', () => {
            expect(escapeXml('a\u0000b\u0001c')).toBe('abc');
            expect(escapeXml('a\u0008b\u000Bc\u000Cd\u007Fe')).toBe('abcde');
            expect(escapeXml('line1\nline2\rline3\tend')).toBe('line1\nline2\rline3\tend');
        });
    });

    describe('sanitizeXmlName', () => {
        it('keeps already-valid names unchanged', () => {
            expect(sanitizeXmlName('book')).toBe('book');
            expect(sanitizeXmlName('book_title')).toBe('book_title');
            expect(sanitizeXmlName('item-1')).toBe('item-1');
        });

        it('replaces invalid characters with underscores', () => {
            expect(sanitizeXmlName('first name')).toBe('first_name');
            expect(sanitizeXmlName('price ($)')).toBe('price____');
            expect(sanitizeXmlName('a/b')).toBe('a_b');
        });

        it('prefixes names that do not start with a letter or underscore', () => {
            expect(sanitizeXmlName('1st')).toBe('_1st');
            expect(sanitizeXmlName('-name')).toBe('_-name');
            expect(sanitizeXmlName('.field')).toBe('_.field');
        });

        it('falls back to "_" for empty input', () => {
            expect(sanitizeXmlName('')).toBe('_');
        });
    });
});
