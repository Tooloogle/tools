import { LitElement } from 'lit';
import { TButton } from "./t-button.js";

describe('t-button web component test', () => {

    const componentTag = "t-button";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TButton', () => {
        const component = window.document.createElement(componentTag) as TButton;
        expect(component).toBeInstanceOf(TButton);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
