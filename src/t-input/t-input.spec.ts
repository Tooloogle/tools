import { LitElement } from 'lit';
import { TInput } from "./t-input.js";

describe('t-input web component test', () => {

    const componentTag = "t-input";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TInput', () => {
        const component = window.document.createElement(componentTag) as TInput;
        expect(component).toBeInstanceOf(TInput);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
