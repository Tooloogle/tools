import { LitElement } from 'lit';
import { RandomNumberGenerator } from "./random-number-generator.js";

describe('random-number-generator web component test', () => {

    const componentTag = "random-number-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RandomNumberGenerator', () => {
        const component = window.document.createElement(componentTag) as RandomNumberGenerator;
        expect(component).toBeInstanceOf(RandomNumberGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
