import { LitElement } from 'lit';
import { DirectToWhatsApp } from "./direct-to-whatsapp.js";

describe('direct-to-whatsapp web component test', () => {

    const componentTag = "direct-to-whatsapp";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        const renderedText = component.renderRoot.querySelector("t-button")?.textContent;
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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
