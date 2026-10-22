import { LitElement } from 'lit';
import { UnixTimestampConverter } from "./unix-timestamp-converter.js";
import { jest } from '@jest/globals';

describe('unix-timestamp-converter web component test', () => {

    const componentTag = "unix-timestamp-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UnixTimestampConverter', () => {
        const component = window.document.createElement(componentTag) as UnixTimestampConverter;
        expect(component).toBeInstanceOf(UnixTimestampConverter);
    });

    it('keeps the public seconds property and preserves instant across unit/timezone changes', async () => {
        const component = new UnixTimestampConverter();
        component.timestamp = 0;
        document.body.appendChild(component);
        await component.updateComplete;
        expect(component.isoOutput).toBe('1970-01-01T00:00:00.000Z');
        const unit = component.shadowRoot!.querySelector<HTMLSelectElement>('[name="unit"]')!;
        unit.value = 'milliseconds';
        unit.dispatchEvent(new Event('change'));
        await component.updateComplete;
        const epoch = component.shadowRoot!.querySelector<HTMLInputElement>('[name="epoch"]')!;
        epoch.value = '1700000000123';
        epoch.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.timestamp).toBe(1700000000);
        expect(component.millisecondsOutput).toBe('1700000000123');
        const zone = component.shadowRoot!.querySelector<HTMLSelectElement>('[name="zone"]')!;
        zone.value = 'utc';
        zone.dispatchEvent(new Event('change'));
        await component.updateComplete;
        expect(component.datetime).toBe('2023-11-14T22:13:20.123');
        expect(component.millisecondsOutput).toBe('1700000000123');
        unit.value = 'seconds';
        unit.dispatchEvent(new Event('change'));
        await component.updateComplete;
        expect(component.epochInput).toBe('1700000000');
        expect(component.millisecondsOutput).toBe('1700000000123');
        component.timestamp = -1;
        await component.updateComplete;
        expect(component.isoOutput).toBe('1969-12-31T23:59:59.000Z');
    });

    it('converts UTC date input, clears invalid output, resets, and supports current time', async () => {
        const component = new UnixTimestampConverter();
        document.body.appendChild(component);
        await component.updateComplete;
        component.zone = 'utc';
        await component.updateComplete;
        const datetime = component.shadowRoot!.querySelector<HTMLInputElement>('[name="datetime"]')!;
        datetime.value = '1970-01-01T00:00:00.123';
        datetime.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.millisecondsOutput).toBe('123');
        const epoch = component.shadowRoot!.querySelector<HTMLInputElement>('[name="epoch"]')!;
        epoch.value = '';
        epoch.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.isoOutput).toBe('');
        expect(component.error).toBeTruthy();
        component.shadowRoot!.querySelector('button')!.click();
        await component.updateComplete;
        expect(component.error).toBe('');
        expect(component.epochInput).toBe('');
        const clock = jest.spyOn(Date, 'now').mockReturnValue(1700000000123);
        try {
            component.shadowRoot!.querySelectorAll('button')[1].click();
            await component.updateComplete;
            expect(component.millisecondsOutput).toBe('1700000000123');
        } finally {
            clock.mockRestore();
        }
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
