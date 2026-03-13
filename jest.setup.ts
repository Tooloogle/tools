// Polyfill TextEncoder/TextDecoder for jsdom (not exposed since jsdom 20)
import { TextEncoder, TextDecoder } from 'util';

if (typeof globalThis.TextEncoder === 'undefined') {
    Object.assign(globalThis, { TextEncoder });
}

if (typeof globalThis.TextDecoder === 'undefined') {
    Object.assign(globalThis, { TextDecoder });
}
