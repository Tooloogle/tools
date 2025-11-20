import { LitElement } from 'lit';
import { DateCalculator } from "./date-calculator.js";

describe('date-calculator web component test', () => {

    const componentTag = "date-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DateCalculator', () => {
        const component = window.document.createElement(componentTag) as DateCalculator;
        expect(component).toBeInstanceOf(DateCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
