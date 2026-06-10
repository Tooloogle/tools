import { LitElement } from 'lit';
import { PercentageCalculator } from "./percentage-calculator.js";

describe('percentage-calculator web component test', () => {

    const componentTag = "percentage-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PercentageCalculator', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        expect(component).toBeInstanceOf(PercentageCalculator);
    });

    it('should render all three calculators', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;

        const headings = component.renderRoot.querySelectorAll('h3');
        expect(headings.length).toBe(3);
        expect(headings[0].textContent).toContain('What is X% of Y?');
        expect(headings[1].textContent).toContain('X is what % of Y?');
        expect(headings[2].textContent).toContain('% Change from X to Y');
    });

    it('should show dash when inputs are empty', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;

        const results = component.renderRoot.querySelectorAll('.text-2xl');
        expect(results[0].textContent?.trim()).toBe('—');
        expect(results[1].textContent?.trim()).toBe('—');
        expect(results[2].textContent?.trim()).toBe('—');
    });

    it('should have six independent input fields', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;

        const inputs = component.renderRoot.querySelectorAll('input');
        expect(inputs.length).toBe(6);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
