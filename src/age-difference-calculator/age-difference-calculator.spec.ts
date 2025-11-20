import { LitElement } from 'lit';
import { AgeDifferenceCalculator } from "./age-difference-calculator.js";

describe('age-difference-calculator web component test', () => {

    const componentTag = "age-difference-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AgeDifferenceCalculator', () => {
        const component = window.document.createElement(componentTag) as AgeDifferenceCalculator;
        expect(component).toBeInstanceOf(AgeDifferenceCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
