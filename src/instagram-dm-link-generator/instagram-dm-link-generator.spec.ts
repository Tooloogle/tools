import { LitElement } from 'lit';
import { InstagramDmLinkGenerator } from './instagram-dm-link-generator.js';

describe('instagram-dm-link-generator web component test', () => {
    const componentTag = 'instagram-dm-link-generator';

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

    it('should be an instance of InstagramDmLinkGenerator', () => {
        const component = document.createElement(componentTag) as InstagramDmLinkGenerator;
        expect(component).toBeInstanceOf(InstagramDmLinkGenerator);
    });

    it('generates a link, rejects unsafe input, and resets', async () => {
        const component = new InstagramDmLinkGenerator();
        document.body.appendChild(component);
        await component.updateComplete;
        const input = component.shadowRoot!.querySelector('input')!;
        input.value = 'https://www.instagram.com/example.user/';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('https://ig.me/m/example.user');
        expect(component.shadowRoot!.querySelector('t-copy-button')!.text).toBe(component.output);
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        expect(component.shadowRoot!.querySelector('textarea')).toBeNull();
        input.value = 'https://evil.test/example';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        expect(component.shadowRoot!.querySelector('a')!.getAttribute('aria-disabled')).toBe('true');
        component.shadowRoot!.querySelector('button')!.click();
        await component.updateComplete;
        expect(component.input).toBe('');
        expect(component.error).toBe('');
    });
});
