import { LitElement } from 'lit';
import { FactorialCalculator } from "./factorial-calculator.js";

describe('factorial-calculator web component test', () => {

    const componentTag = "factorial-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of FactorialCalculator', () => {
        const component = window.document.createElement(componentTag) as FactorialCalculator;
        expect(component).toBeInstanceOf(FactorialCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
