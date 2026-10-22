import { LitElement } from 'lit';
import { UtmTrackerRemover } from './utm-tracker-remover.js';

describe('utm-tracker-remover web component test', () => {
    const componentTag = 'utm-tracker-remover';

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

    it('should be an instance of UtmTrackerRemover', () => {
        const component = document.createElement(componentTag) as UtmTrackerRemover;
        expect(component).toBeInstanceOf(UtmTrackerRemover);
    });

    it('cleans live, respects tracker opt-in, and clears invalid output', async () => {
        const component = new UtmTrackerRemover();
        document.body.appendChild(component);
        await component.updateComplete;
        const input = component.shadowRoot!.querySelector<HTMLInputElement>('[name="url"]')!;
        input.value = 'https://example.test/?utm_source=x&gclid=keep&id=5#anchor';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(new URL(component.output).searchParams.get('gclid')).toBe('keep');
        expect(component.removed).toEqual(['utm_source']);
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        expect(component.shadowRoot!.querySelector('textarea')).toBeNull();
        const checkbox = component.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
        await component.updateComplete;
        expect(component.output).toBe('https://example.test/?id=5#anchor');
        expect(component.removed).toEqual(['utm_source', 'gclid']);
        input.value = 'javascript:alert(1)';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.removed).toEqual([]);
        component.shadowRoot!.querySelector('button')!.click();
        await component.updateComplete;
        expect(component.extraTrackers).toBe(false);
        expect(component.input).toBe('');
        expect(component.error).toBe('');
    });
});
