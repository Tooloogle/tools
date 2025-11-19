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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
