import { LitElement } from 'lit';
import { GcdCalculator } from "./gcd-calculator.js";

describe('gcd-calculator web component test', () => {

    const componentTag = "gcd-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of GcdCalculator', () => {
        const component = window.document.createElement(componentTag) as GcdCalculator;
        expect(component).toBeInstanceOf(GcdCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
