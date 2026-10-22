import { normalizeInternationalPhone } from './messaging-links.js';

export function buildInstagramUrl(input: string): string {
    let username = input.trim();
    if (/^(https?:\/\/|(?:www\.)?instagram\.com\/)/i.test(username)) {
        const url = new URL(/^https?:/i.test(username) ? username : `https://${username}`);
        if (!['instagram.com', 'www.instagram.com'].includes(url.hostname) || url.username || url.password || url.port) {
            throw new Error('Enter an Instagram profile URL or username.');
        }

        const profile = /^\/([^/]+)\/?$/.exec(url.pathname);
        username = profile ? profile[1] : '';
    }

    username = username.replace(/^@/, '');
    if (!/^(?!.*\.\.)[A-Za-z0-9_](?:[A-Za-z0-9_.]{0,28}[A-Za-z0-9_])?$/.test(username)) {
        throw new Error('Enter a valid Instagram username.');
    }

    return `https://ig.me/m/${username}`;
}

export function buildViberUrl(phone: string): string {
    return `viber://chat?number=${encodeURIComponent(`+${normalizeInternationalPhone(phone)}`)}`;
}

export function buildSignalUrl(input: string, mode: string): string {
    if (mode === 'phone') {
        return `https://signal.me/#p/+${normalizeInternationalPhone(input)}`;
    }

    const url = new URL(input.trim());
    const validOrigin = url.protocol === 'https:' && url.hostname === 'signal.me' && !url.port;
    const validPath = url.pathname === '/' && !url.search && !url.username && !url.password;
    const personal = /^#(?:eu\/[A-Za-z0-9_-]+={0,2}|p\/\+[1-9]\d{1,14})$/.test(url.hash);
    if (!validOrigin || !validPath || !personal) {
        throw new Error('Enter a personal share link copied from Signal.');
    }

    return url.href;
}