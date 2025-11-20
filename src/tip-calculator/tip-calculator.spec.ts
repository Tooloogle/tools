import { LitElement } from 'lit';
import { TipCalculator } from "./tip-calculator.js";

describe('tip-calculator web component test', () => {

    const componentTag = "tip-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TipCalculator', () => {
        const component = window.document.createElement(componentTag) as TipCalculator;
        expect(component).toBeInstanceOf(TipCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
