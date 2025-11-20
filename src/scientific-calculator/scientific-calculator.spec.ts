import { LitElement } from 'lit';
import { ScientificCalculator } from "./scientific-calculator.js";

describe('scientific-calculator web component test', () => {

    const componentTag = "scientific-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ScientificCalculator', () => {
        const component = window.document.createElement(componentTag) as ScientificCalculator;
        expect(component).toBeInstanceOf(ScientificCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
