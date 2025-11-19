import { LitElement } from 'lit';
import { PercentageCalculator } from "./percentage-calculator.js";

describe('percentage-calculator web component test', () => {

    const componentTag = "percentage-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PercentageCalculator', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        expect(component).toBeInstanceOf(PercentageCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
