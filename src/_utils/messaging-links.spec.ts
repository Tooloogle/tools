import { buildWhatsAppUrl, normalizeInternationalPhone } from './messaging-links.js';

describe('messaging links', () => {
    it('normalizes display separators without removing meaningful zeros', () => {
        expect(normalizeInternationalPhone('+44 (20) 7000-0000')).toBe('442070000000');
    });

    it.each(['', '+00123456789', '123abc456', '++44123456789', '123+456', '1234567890123456'])('rejects invalid phone %s', (phone) => {
        expect(() => normalizeInternationalPhone(phone)).toThrow();
    });

    it('encodes message text exactly once', () => {
        const text = '  *Hello* & + 50%\n\u{1f44b}';
        const url = new URL(buildWhatsAppUrl('+1 (202) 555-0123', text));
        expect(url.pathname).toBe('/12025550123');
        expect(url.searchParams.get('text')).toBe(text);
    });

    it('supports a recipient-free message and omits an empty message', () => {
        expect(buildWhatsAppUrl('', 'hello')).toBe('https://wa.me/?text=hello');
        expect(buildWhatsAppUrl('12025550123')).toBe('https://wa.me/12025550123');
    });
});