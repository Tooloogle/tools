import { LitElement } from 'lit';
import { GoldPurityCalculator } from "./gold-purity-calculator.js";

describe('gold-purity-calculator web component test', () => {

    const componentTag = "gold-purity-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of GoldPurityCalculator', () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        expect(component).toBeInstanceOf(GoldPurityCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
