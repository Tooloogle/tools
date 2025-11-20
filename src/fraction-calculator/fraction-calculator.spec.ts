import { LitElement } from 'lit';
import { FractionCalculator } from "./fraction-calculator.js";

describe('fraction-calculator web component test', () => {

    const componentTag = "fraction-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of FractionCalculator', () => {
        const component = window.document.createElement(componentTag) as FractionCalculator;
        expect(component).toBeInstanceOf(FractionCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
