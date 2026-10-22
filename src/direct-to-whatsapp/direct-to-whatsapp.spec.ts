import { LitElement } from 'lit';
import { DirectToWhatsApp } from "./direct-to-whatsapp.js";

describe('direct-to-whatsapp web component test', () => {

    const componentTag = "direct-to-whatsapp";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        const renderedText = component.renderRoot.querySelector("button.btn")?.textContent;
        expect(renderedText).toEqual('Open in Whatsapp');
    });

    it('should be an instance of DirectToWhatsApp', () => {
        const component = window.document.createElement(componentTag) as DirectToWhatsApp;
        expect(component).toBeInstanceOf(DirectToWhatsApp);
    });

    it('should have initial phone property as empty string', () => {
        const component = window.document.createElement(componentTag) as DirectToWhatsApp;
        expect(component.phone).toBe("");
    });

    it('generates a single-line link and submits the same normalized recipient and message', async () => {
        const component = new DirectToWhatsApp();
        document.body.appendChild(component);
        await component.updateComplete;
        const phone = component.shadowRoot!.querySelector<HTMLInputElement>('[data-input="phone"]')!;
        const message = component.shadowRoot!.querySelector('textarea')!;
        phone.value = '+1 (202) 555-0123';
        phone.dispatchEvent(new Event('input'));
        message.value = '  *Hello* & +\nfriend';
        message.dispatchEvent(new Event('input'));
        await component.updateComplete;
        const url = new URL(component.output);
        expect(url.pathname).toBe('/12025550123');
        expect(url.searchParams.get('text')).toBe(message.value);
        const form = component.shadowRoot!.querySelector('form')!;
        const payload = new FormData(form);
        expect(payload.get('phone')).toBe('12025550123');
        expect(payload.get('text')).toBe(message.value);
        expect(payload.has('link')).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        const copy = component.shadowRoot!.querySelector('t-copy-button')!;
        expect(copy.isIcon).toBe(false);
        expect(copy.text).toBe(component.output);
        const submit = new Event('submit', { cancelable: true });
        expect(component.validateForm(submit)).toBe(true);
        expect(submit.defaultPrevented).toBe(false);
    });

    it('rejects invalid submission and resets link, message and error', async () => {
        const component = new DirectToWhatsApp();
        document.body.appendChild(component);
        await component.updateComplete;
        const phone = component.shadowRoot!.querySelector<HTMLInputElement>('[data-input="phone"]')!;
        phone.value = 'bad';
        phone.dispatchEvent(new Event('input'));
        await component.updateComplete;
        const submit = new Event('submit', { cancelable: true });
        expect(component.validateForm(submit)).toBe(false);
        expect(submit.defaultPrevented).toBe(true);
        expect(component.output).toBe('');
        expect(component.error).toBeTruthy();
        expect(component.shadowRoot!.querySelector('t-copy-button')!.disabled).toBe(true);
        component.shadowRoot!.querySelector<HTMLButtonElement>('button[type="button"]')!.click();
        await component.updateComplete;
        expect(component.phone).toBe('');
        expect(component.message).toBe('');
        expect(component.error).toBe('');
    });

    it('synchronizes a prefilled recipient before the synchronous form payload is read', async () => {
        const component = new DirectToWhatsApp();
        component.phone = '+1 (202) 555-0123';
        document.body.appendChild(component);
        await component.updateComplete;
        const form = component.shadowRoot!.querySelector('form')!;
        const submit = new Event('submit', { cancelable: true });
        expect(form.dispatchEvent(submit)).toBe(true);
        expect(new FormData(form).get('phone')).toBe('12025550123');
        component.phone = '+44 7700 900123';
        form.dispatchEvent(new Event('submit', { cancelable: true }));
        expect(new FormData(form).get('phone')).toBe('447700900123');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
