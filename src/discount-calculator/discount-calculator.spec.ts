import { LitElement } from 'lit';
import { DiscountCalculator } from "./discount-calculator.js";

describe('discount-calculator web component test', () => {

    const componentTag = "discount-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DiscountCalculator', () => {
        const component = window.document.createElement(componentTag) as DiscountCalculator;
        expect(component).toBeInstanceOf(DiscountCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
