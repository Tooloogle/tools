import { LitElement } from 'lit';
import { jest } from '@jest/globals';
import { WhatsappQrGenerator } from './whatsapp-qr-generator.js';

const append = jest.fn();
const update = jest.fn();
const download = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
const constructor = jest.fn();
jest.unstable_mockModule('qr-code-styling', () => ({
    default: class {
        constructor(options: unknown) { constructor(options); }
        append = append;
        update = update;
        download = download;
        getRawData = () => Promise.resolve(new Blob());
    }
}));

describe('whatsapp-qr-generator web component test', () => {
    const componentTag = 'whatsapp-qr-generator';

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

    it('should be an instance of WhatsappQrGenerator', () => {
        const component = document.createElement(componentTag) as InstanceType<typeof WhatsappQrGenerator>;
        expect(component).toBeInstanceOf(WhatsappQrGenerator);
    });

    it('uses the exact WhatsApp URL in the QR and clears it on invalid input', async () => {
        const component = new WhatsappQrGenerator();
        document.body.appendChild(component);
        await component.updateComplete;
        const phone = component.shadowRoot!.querySelector('input')!;
        phone.value = '+12025550123';
        phone.dispatchEvent(new Event('input'));
        await component.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 0));
        await component.updateComplete;
        expect(constructor).toHaveBeenCalledWith(expect.objectContaining({ data: component.output, margin: 16 }));
        expect(append).toHaveBeenCalledTimes(1);
        expect(component.ready).toBe(true);
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        const message = component.shadowRoot!.querySelector('textarea')!;
        message.value = '*Hello* & +\nfriend';
        message.dispatchEvent(new Event('input'));
        await component.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 0));
        await component.updateComplete;
        expect(update).toHaveBeenLastCalledWith({ data: component.output });
        expect(new URL(component.output).searchParams.get('text')).toBe(message.value);
        component.shadowRoot!.querySelector<HTMLButtonElement>('[data-extension="png"]')!.click();
        expect(download).toHaveBeenCalledWith({ name: 'whatsapp-qr', extension: 'png' });
        phone.value = 'bad';
        phone.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.ready).toBe(false);
        expect(component.shadowRoot!.querySelector<HTMLButtonElement>('[data-extension="png"]')!.disabled).toBe(true);
    });
});
