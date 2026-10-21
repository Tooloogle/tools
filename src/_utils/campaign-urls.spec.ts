import { buildUtmUrl, cleanTrackingUrl, parseWebUrl, readUtmFields } from './campaign-urls.js';

describe('campaign URLs', () => {
    const fields = { source: 'Newsletter', medium: 'email', campaign: 'Spring & Summer', term: '', content: '+ coupon 50%', id: '' };

    it('replaces duplicates and case variants without changing functional parameters or fragments', () => {
        const url = new URL(buildUtmUrl('https://example.test/shop?page=2&utm_source=old&utm_source=other&UTM_SOURCE=OLD&utm_term=remove#offers', fields));
        expect(url.searchParams.getAll('utm_source')).toEqual(['Newsletter']);
        expect(url.searchParams.has('UTM_SOURCE')).toBe(false);
        expect(url.searchParams.has('utm_term')).toBe(false);
        expect(url.searchParams.get('page')).toBe('2');
        expect(url.searchParams.get('utm_campaign')).toBe('Spring & Summer');
        expect(url.searchParams.get('utm_content')).toBe('+ coupon 50%');
        expect(url.hash).toBe('#offers');
    });

    it('reads existing campaign fields and requires the three primary fields', () => {
        expect(readUtmFields('https://example.test/?UTM_SOURCE=existing&utm_medium=email').source).toBe('existing');
        expect(() => buildUtmUrl('https://example.test', { ...fields, campaign: ' ' })).toThrow();
    });

    it('removes only UTM keys by default, including duplicates and mixed case', () => {
        const result = cleanTrackingUrl('https://example.test/path?UTM_Source=a&utm_source=b&utm_source=c&utm_custom=d&gclid=keep&ref=x&id=5#section');
        const url = new URL(result.url);
        expect(result.removed).toEqual(['UTM_Source', 'utm_source', 'utm_custom']);
        expect(url.searchParams.get('gclid')).toBe('keep');
        expect(url.searchParams.get('ref')).toBe('x');
        expect(url.searchParams.get('id')).toBe('5');
        expect(url.hash).toBe('#section');
    });

    it('removes known click trackers only when requested and preserves no-op input bytes', () => {
        expect(cleanTrackingUrl('https://example.test/?FBCLID=x&token=keep', true).url).toBe('https://example.test/?token=keep');
        const original = 'https://example.test/path?q=a%20b&token=secret#section';
        expect(cleanTrackingUrl(` ${original} `)).toEqual({ url: original, removed: [] });
    });

    it.each(['relative/path', 'javascript:alert(1)', 'data:text/plain,hello', 'https://user:secret@example.test/'])('rejects unsafe URL %s', (url) => {
        expect(() => parseWebUrl(url)).toThrow();
    });
});