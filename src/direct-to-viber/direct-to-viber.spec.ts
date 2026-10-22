import { LitElement } from 'lit';
import { DirectToViber } from './direct-to-viber.js';

describe('direct-to-viber web component test', () => {
    const componentTag = 'direct-to-viber';

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

    it('should be an instance of DirectToViber', () => {
        const component = document.createElement(componentTag) as DirectToViber;
        expect(component).toBeInstanceOf(DirectToViber);
    });

    it('encodes a phone link and clears invalid and reset output', async () => {
        const component = new DirectToViber();
        document.body.appendChild(component);
        await component.updateComplete;
        const input = component.shadowRoot!.querySelector('input')!;
        input.value = '+12025550123';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('viber://chat?number=%2B12025550123');
        expect(component.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe(component.output);
        expect(component.shadowRoot!.querySelector('t-copy-button')!.isIcon).toBe(false);
        const output = component.shadowRoot!.querySelector<HTMLInputElement>('[data-output]')!;
        expect(output.readOnly).toBe(true);
        expect(output.value).toBe(component.output);
        expect(component.shadowRoot!.querySelector('textarea')).toBeNull();
        input.value = 'bad';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.output).toBe('');
        component.shadowRoot!.querySelector('button')!.click();
        await component.updateComplete;
        expect(component.phone).toBe('');
        expect(component.error).toBe('');
    });
});
