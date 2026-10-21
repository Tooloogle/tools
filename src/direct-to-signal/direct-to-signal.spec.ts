import { LitElement } from 'lit';
import { DirectToSignal } from './direct-to-signal.js';

describe('direct-to-signal web component test', () => {
    const componentTag = 'direct-to-signal';

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

    it('should be an instance of DirectToSignal', () => {
        const component = document.createElement(componentTag) as DirectToSignal;
        expect(component).toBeInstanceOf(DirectToSignal);
    });

    it('supports phone and opaque personal link modes but rejects group links', async () => {
        const component = new DirectToSignal();
        document.body.appendChild(component);
        await component.updateComplete;
        const input = component.shadowRoot!.querySelector<HTMLInputElement>('[name="contact"]')!;
        input.value = '+12025550123';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('https://signal.me/#p/+12025550123');
        const mode = component.shadowRoot!.querySelector<HTMLInputElement>('[name="mode"][value="link"]')!;
        mode.click();
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.mode).toBe('link');
        expect(input.value).toBe('');
        expect(mode.checked).toBe(true);
        expect(component.shadowRoot!.querySelector<HTMLInputElement>('[name="mode"][value="phone"]')!.checked).toBe(false);
        expect(component.shadowRoot!.querySelector('select')).toBeNull();
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        input.value = 'https://signal.me/#eu/opaque-token_123';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe(input.value);
        expect(component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!.value).toBe(component.output);
        input.value = 'https://signal.group/#token';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.error).toBeTruthy();
        component.shadowRoot!.querySelector<HTMLInputElement>('[name="mode"][value="phone"]')!.click();
        await component.updateComplete;
        expect(component.input).toBe('');
        expect(component.error).toBe('');
    });
});
