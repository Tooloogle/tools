import { LitElement } from 'lit';
import { UtmUrlBuilder } from './utm-url-builder.js';

describe('utm-url-builder web component test', () => {
    const componentTag = 'utm-url-builder';

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should render web component', async () => {
        const component = document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;
        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UtmUrlBuilder', () => {
        const component = document.createElement(componentTag) as UtmUrlBuilder;
        expect(component).toBeInstanceOf(UtmUrlBuilder);
    });

    it('loads existing fields, regenerates live output, and resets', async () => {
        const component = new UtmUrlBuilder();
        document.body.appendChild(component);
        await component.updateComplete;
        const input = component.shadowRoot!.querySelector<HTMLInputElement>('[name="url"]')!;
        input.value = 'https://example.test/?id=5&utm_source=old&utm_medium=email&utm_campaign=spring#offer';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        const source = component.shadowRoot!.querySelector<HTMLInputElement>('[name="source"]')!;
        expect(source.value).toBe('old');
        source.value = 'new & +';
        source.dispatchEvent(new Event('input'));
        await component.updateComplete;
        const url = new URL(component.output);
        expect(url.searchParams.get('utm_source')).toBe('new & +');
        expect(url.searchParams.get('id')).toBe('5');
        expect(url.hash).toBe('#offer');
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        expect(component.shadowRoot!.querySelector('textarea')).toBeNull();
        source.value = '';
        source.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.error).toBeTruthy();
        component.shadowRoot!.querySelector('button')!.click();
        await component.updateComplete;
        expect(input.value).toBe('');
        expect(source.value).toBe('');
        expect(component.error).toBe('');
    });
});
