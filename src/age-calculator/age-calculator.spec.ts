import { LitElement } from 'lit';
import { AgeCalculator } from "./age-calculator.js";

describe('age-calculator web component test', () => {

    const componentTag = "age-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AgeCalculator', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        expect(component).toBeInstanceOf(AgeCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
