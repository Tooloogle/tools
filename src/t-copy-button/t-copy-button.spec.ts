import { LitElement } from 'lit';
import { TCopyButton } from "./t-copy-button.js";

describe('t-copy-button web component test', () => {

    const componentTag = "t-copy-button";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TCopyButton', () => {
        const component = window.document.createElement(componentTag) as TCopyButton;
        expect(component).toBeInstanceOf(TCopyButton);
    });

    it('should mark the button as disabled when disabled is set', async () => {
        const component = window.document.createElement(componentTag) as TCopyButton;
        component.disabled = true;
        document.body.appendChild(component);

        await component.updateComplete;

        const button = component.renderRoot.querySelector('button');
        expect(button?.hasAttribute('disabled')).toBe(true);
    });

    it('should use the standard action size for text copy buttons', async () => {
        const component = window.document.createElement(componentTag) as TCopyButton;
        component.isIcon = false;
        document.body.appendChild(component);

        await component.updateComplete;

        const label = component.renderRoot.querySelector('.btn');
        expect(label?.textContent).toBe('Copy');
        expect(label?.classList.contains('btn-green')).toBe(true);
        expect(label?.classList.contains('btn-sm')).toBe(false);
    });

    it('should support small text buttons and react to size changes', async () => {
        const component = window.document.createElement(componentTag) as TCopyButton;
        component.isIcon = false;
        component.setAttribute('size', 'sm');
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component.size).toBe('sm');
        expect(component.renderRoot.querySelector('.btn')?.classList.contains('btn-sm')).toBe(true);

        component.size = 'md';
        await component.updateComplete;

        expect(component.renderRoot.querySelector('.btn')?.classList.contains('btn-sm')).toBe(false);
    });

    it('should keep icon copy buttons without action-button styling', async () => {
        const component = window.document.createElement(componentTag) as TCopyButton;
        component.size = 'sm';
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component.renderRoot.querySelector('.btn')).toBeNull();
        expect(component.renderRoot.querySelector('.text-lg')).not.toBeNull();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
