import { LitElement } from 'lit';
import { BmiCalculator } from "./bmi-calculator.js";

describe('bmi-calculator web component test', () => {

    const componentTag = "bmi-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BmiCalculator', () => {
        const component = window.document.createElement(componentTag) as BmiCalculator;
        expect(component).toBeInstanceOf(BmiCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
