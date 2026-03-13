// Polyfill TextEncoder/TextDecoder for jsdom (not exposed since jsdom 20)
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });
