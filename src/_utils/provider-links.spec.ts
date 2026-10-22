import { buildInstagramUrl, buildSignalUrl, buildViberUrl } from './provider-links.js';

describe('provider links', () => {
    it.each(['@example.user', 'example.user', 'https://www.instagram.com/example.user/?igsh=test', 'instagram.com/example.user/'])('accepts Instagram profile %s', (input) => {
        expect(buildInstagramUrl(input)).toBe('https://ig.me/m/example.user');
    });

    it.each(['john-doe', 'a..b', 'https://instagram.com.attacker.test/example', 'https://instagram.com/p/123/', 'javascript:alert(1)', 'https://user@instagram.com/example/'])('rejects Instagram input %s', (input) => {
        expect(() => buildInstagramUrl(input)).toThrow();
    });

    it('encodes the plus sign in Viber chat query', () => {
        expect(buildViberUrl('+44 (20) 7000-0000')).toBe('viber://chat?number=%2B442070000000');
    });

    it('builds Signal phone links and preserves opaque personal share links', () => {
        expect(buildSignalUrl('+12025550123', 'phone')).toBe('https://signal.me/#p/+12025550123');
        expect(buildSignalUrl('https://signal.me/#eu/opaque-token_123', 'link')).toBe('https://signal.me/#eu/opaque-token_123');
    });

    it.each(['username.12', 'https://signal.group/#token', 'https://signal.me.attacker.test/#eu/token',
        'http://signal.me/#eu/token', 'https://signal.me/#group/token', 'https://user@signal.me/#eu/token',
        'https://signal.me/elsewhere#eu/token', 'https://signal.me/#eu/'])('rejects unsafe or non-personal Signal link %s', (input) => {
        expect(() => buildSignalUrl(input, 'link')).toThrow();
    });
});