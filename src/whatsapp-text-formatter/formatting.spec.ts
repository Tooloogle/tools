import { render } from 'lit';
import { formatSelection, renderMessagePreview } from './formatting.js';

describe('WhatsApp formatting', () => {
    it('renders combined emphasis while keeping code literal and escaping markup', () => {
        const container = document.createElement('div');
        render(renderMessagePreview('_*word*_ `*literal*` ```_*literal*_``` <img>'), container);
        expect(container.querySelector('em strong')!.textContent).toBe('word');
        expect([...container.querySelectorAll('code')].map(code => code.textContent)).toEqual(['*literal*', '_*literal*_']);
        expect(container.querySelector('code strong')).toBeNull();
        expect(container.querySelector('img')).toBeNull();
        render(renderMessagePreview('*`*literal*`*'), container);
        expect(container.querySelector('strong code')!.textContent).toBe('*literal*');
    });

    it.each([
        ['hello ```world```!', ['hello world!']],
        ['hello ```one\ntwo```!', ['hello one', 'two!']],
        ['first\n```one\ntwo```\nlast', ['first', 'one', 'two', 'last']],
    ])('preserves line boundaries around monospace in %s', (text, expected) => {
        const container = document.createElement('div');
        render(renderMessagePreview(text), container);
        expect([...container.children].map(line => line.textContent)).toEqual(expected);
    });

    it.each([['bold', '*'], ['italic', '_'], ['strike', '~'], ['monospace', '```'], ['code', '`']])('wraps and toggles %s', (command, marker) => {
        const initial = { text: 'hello world', start: 6, end: 11 };
        const result = formatSelection(initial, command);
        expect(result.text).toBe(`hello ${marker}world${marker}`);
        expect(formatSelection(result, command)).toEqual(initial);
    });

    it.each(['```one\n\ntwo```', '```one\n\n\ntwo```', '```\none\n```'])(
        'keeps blank monospace lines visible in %s', text => {
            const container = document.createElement('div');
            render(renderMessagePreview(text), container);
            const expected = text.slice(3, -3).split('\n');
            expect([...container.children].map(line => line.textContent)).toEqual(expected);
            [...container.children].forEach((line, index) => {
                expect(line.querySelector('br')!.hidden).toBe(expected[index] !== '');
            });
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