export function parseEpoch(input: string, unit: string): number {
    if (!/^[+-]?\d+$/.test(input.trim())) {
        throw new Error('Enter a whole-number timestamp.');
    }

    const milliseconds = Number(input) * (unit === 'milliseconds' ? 1 : 1000);
    if (!Number.isSafeInteger(milliseconds) || Math.abs(milliseconds) > 8640000000000000) {
        throw new Error('Timestamp is outside the supported date range.');
    }

    return milliseconds;
}

function dateParts(date: Date, zone: string): number[] {
    return zone === 'utc'
        ? [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()]
        : [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(),
            date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
}

export function dateTimeInput(milliseconds: number, zone: string): string {
    const [year, month, day, hour, minute, second, millisecond] = dateParts(new Date(milliseconds), zone);
    const pad = (value: number) => String(value).padStart(2, '0');
    const yearText = year >= 0 && year <= 9999 ? String(year).padStart(4, '0')
        : `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
    return `${yearText}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}.${String(millisecond).padStart(3, '0')}`;
}

export function parseDateTime(input: string, zone: string): number {
    const match = /^(\d{4}|[+-]\d{6})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(input);
    if (!match) {
        throw new Error('Enter a valid date and time.');
    }

    const parts = match.slice(1, 7).map(value => Number(value ?? 0));
    parts.push(Number((match[7] ?? '').padEnd(3, '0')));
    const [year, month, day, hour, minute, second, millisecond] = parts;
    const date = new Date(0);
    if (zone === 'utc') {
        date.setUTCFullYear(year, month - 1, day);
        date.setUTCHours(hour, minute, second, millisecond);
    } else {
        date.setFullYear(year, month - 1, day);
        date.setHours(hour, minute, second, millisecond);
    }

    if (!Number.isFinite(date.getTime()) || dateParts(date, zone).some((part, index) => part !== parts[index])) {
        throw new Error('Enter a valid date and time in the selected timezone.');
    }

    return date.getTime();
}