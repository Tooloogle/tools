import { dateTimeInput, parseDateTime, parseEpoch } from './epoch.js';

describe('epoch conversion', () => {
    it('handles zero, negatives, and explicit seconds/milliseconds', () => {
        expect(parseEpoch('0', 'seconds')).toBe(0);
        expect(parseEpoch('-1', 'seconds')).toBe(-1000);
        expect(parseEpoch('1700000000', 'seconds')).toBe(parseEpoch('1700000000000', 'milliseconds'));
        expect(dateTimeInput(-1, 'utc')).toBe('1969-12-31T23:59:59.999');
    });

    it.each(['', ' ', 'NaN', 'Infinity', '1.5', '9007199254740992', '8640000000000001'])('rejects invalid epoch %s', (value) => {
        expect(() => parseEpoch(value, 'milliseconds')).toThrow();
    });

    it('parses UTC exactly and preserves millisecond precision', () => {
        expect(parseDateTime('1970-01-01T00:00:00', 'utc')).toBe(0);
        expect(parseDateTime('2023-11-14T22:13:20.123', 'utc')).toBe(1700000000123);
        expect(parseDateTime('0020-01-01T00:00', 'utc')).toBe(Date.parse('0020-01-01T00:00:00Z'));
    });

    it('round trips local date input using the browser timezone', () => {
        const instant = 1700000000123;
        expect(parseDateTime(dateTimeInput(instant, 'local'), 'local')).toBe(instant);
    });

    it.each(['2023-02-29T00:00', '2024-13-01T00:00', '2024-01-01T25:00', 'invalid'])('rejects invalid date %s', (value) => {
        expect(() => parseDateTime(value, 'utc')).toThrow();
    });
});