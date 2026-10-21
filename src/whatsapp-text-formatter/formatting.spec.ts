import { formatSelection } from './formatting.js';

describe('WhatsApp formatting', () => {
    it.each([['bold', '*'], ['italic', '_'], ['strike', '~'], ['monospace', '```'], ['code', '`']])('wraps and toggles %s', (command, marker) => {
        const initial = { text: 'hello world', start: 6, end: 11 };
        const result = formatSelection(initial, command);
        expect(result.text).toBe(`hello ${marker}world${marker}`);
        expect(formatSelection(result, command)).toEqual(initial);
    });

    it('inserts markers around a caret', () => {
        expect(formatSelection({ text: 'hello', start: 5, end: 5 }, 'bold')).toEqual({ text: 'hello**', start: 6, end: 6 });
    });

    it.each([['bullet', '- one\n- two'], ['numbered', '1. one\n2. two'], ['quote', '> one\n> two']])('formats selected lines as %s', (command, expected) => {
        const selection = { text: 'one\ntwo\nthree', start: 1, end: 8 };
        const formatted = formatSelection(selection, command);
        expect(formatted.text).toBe(`${expected}\nthree`);
        expect(formatSelection(formatted, command).text).toBe(selection.text);
    });
});