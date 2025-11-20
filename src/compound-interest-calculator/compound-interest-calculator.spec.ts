import { LitElement } from 'lit';
import { CompoundInterestCalculator } from "./compound-interest-calculator.js";

describe('compound-interest-calculator web component test', () => {

    const componentTag = "compound-interest-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CompoundInterestCalculator', () => {
        const component = window.document.createElement(componentTag) as CompoundInterestCalculator;
        expect(component).toBeInstanceOf(CompoundInterestCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
