import { LitElement } from 'lit-element';
import "./direct-to-whatsapp.js";

describe(' direct-to-whatsapp web component test', () => {

    const componentTag = "direct-to-whatsapp";
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        const renderedText = component.renderRoot.querySelector("button.btn")?.textContent;
        expect(renderedText).toEqual('Open in Whatsapp');
    });
});
