import { LitElement } from 'lit';
import { WhatsappTextFormatter } from './whatsapp-text-formatter.js';

describe('whatsapp-text-formatter web component test', () => {
    const componentTag = 'whatsapp-text-formatter';

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

    it('should be an instance of WhatsappTextFormatter', () => {
        const component = document.createElement(componentTag) as WhatsappTextFormatter;
        expect(component).toBeInstanceOf(WhatsappTextFormatter);
    });

    it('renders small inline SVG icons with accessible toolbar labels', async () => {
        const component = new WhatsappTextFormatter();
        document.body.appendChild(component);
        await component.updateComplete;
        const buttons = component.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tool-button');
        expect(buttons).toHaveLength(10);
        for (const button of buttons) {
            expect(button.getAttribute('aria-label')).toBe(button.title);
            const icon = button.querySelector('svg')!;
            expect(icon.namespaceURI).toBe('http://www.w3.org/2000/svg');
            expect(icon.getAttribute('width')).toBe('16');
            expect(icon.getAttribute('height')).toBe('16');
            expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(icon.getAttribute('focusable')).toBe('false');
            expect(icon.querySelector('path')!.namespaceURI).toBe('http://www.w3.org/2000/svg');
        }
        component.text = 'updated';
        await component.updateComplete;
        expect(component.shadowRoot!.querySelectorAll('.tool-button svg')).toHaveLength(10);
    });

    it('preserves selection and supports undo, redo, copy, and recipient-free sending', async () => {
        const component = new WhatsappTextFormatter();
        document.body.appendChild(component);
        await component.updateComplete;
        const editor = component.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
        editor.value = 'hello world';
        editor.dispatchEvent(new Event('input'));
        await component.updateComplete;
        editor.focus();
        editor.setSelectionRange(6, 11);
        component.shadowRoot!.querySelector<HTMLButtonElement>('[data-command="bold"]')!.click();
        await component.updateComplete;
        expect(component.text).toBe('hello *world*');
        expect(editor.selectionStart).toBe(6);
        expect(editor.selectionEnd).toBe(13);
        expect(component.shadowRoot!.activeElement).toBe(editor);
        expect(component.shadowRoot!.querySelector('strong')!.textContent).toBe('world');
        expect(new URL(component.sendUrl).pathname).toBe('/');
        expect(new URL(component.sendUrl).searchParams.get('text')).toBe(component.text);
        component.shadowRoot!.querySelector<HTMLButtonElement>('[data-command="undo"]')!.click();
        await component.updateComplete;
        expect(component.text).toBe('hello world');
        component.shadowRoot!.querySelector<HTMLButtonElement>('[data-command="redo"]')!.click();
        await component.updateComplete;
        expect(component.text).toBe('hello *world*');
        expect(component.shadowRoot!.querySelector('t-copy-button')!.text).toBe(component.text);
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const phone = component.shadowRoot!.querySelector('input')!;
        phone.value = '+12025550123';
        phone.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(new URL(component.sendUrl).pathname).toBe('/12025550123');
        phone.value = 'bad';
        phone.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.sendUrl).toBe('');
        expect(component.error).toBeTruthy();
    });

    it('escapes preview markup and resets the editor', async () => {
        const component = new WhatsappTextFormatter();
        document.body.appendChild(component);
        await component.updateComplete;
        const editor = component.shadowRoot!.querySelector('textarea')!;
        editor.value = '<img src=x onerror=alert(1)>';
        editor.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.shadowRoot!.querySelector('img')).toBeNull();
        expect(component.shadowRoot!.querySelector('.message-preview')!.textContent).toContain('<img');
        component.shadowRoot!.querySelector<HTMLButtonElement>('button.btn')!.click();
        await component.updateComplete;
        expect(component.text).toBe('');
        expect(component.sendUrl).toBe('');
    });
});
