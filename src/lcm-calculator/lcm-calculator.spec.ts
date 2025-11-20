import { LitElement } from 'lit';
import { LcmCalculator } from "./lcm-calculator.js";

describe('lcm-calculator web component test', () => {

    const componentTag = "lcm-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LcmCalculator', () => {
        const component = window.document.createElement(componentTag) as LcmCalculator;
        expect(component).toBeInstanceOf(LcmCalculator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
