import { LitElement } from 'lit';
import { SimpleInterestCalculator } from "./simple-interest-calculator.js";

describe('simple-interest-calculator web component test', () => {

    const componentTag = "simple-interest-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SimpleInterestCalculator', () => {
        const component = window.document.createElement(componentTag) as SimpleInterestCalculator;
        expect(component).toBeInstanceOf(SimpleInterestCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
