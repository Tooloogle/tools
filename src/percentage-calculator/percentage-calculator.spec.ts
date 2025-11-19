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

    it('should have initial zero values', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        expect(component.value1).toBe(0);
        expect(component.value2).toBe(0);
        expect(component.percentage).toBe(0);
        expect(component.result1).toBe(0);
        expect(component.result2).toBe(0);
        expect(component.result3).toBe(0);
    });

    it('should calculate "What is X% of Y?" correctly', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.percentage = 20;
        component.value2 = 100;
        component['calculate']();

        expect(component.result1).toBe(20); // 20% of 100 = 20
    });

    it('should calculate "X is what % of Y?" correctly', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.value1 = 25;
        component.value2 = 100;
        component['calculate']();

        expect(component.result2).toBe(25); // 25 is 25% of 100
    });

    it('should calculate percentage increase correctly', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.value1 = 100;
        component.value2 = 150;
        component['calculate']();

        expect(component.result3).toBe(50); // 50% increase from 100 to 150
    });

    it('should calculate percentage decrease correctly', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.value1 = 100;
        component.value2 = 50;
        component['calculate']();

        expect(component.result3).toBe(-50); // 50% decrease from 100 to 50
    });

    it('should handle zero division for result2', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.value1 = 50;
        component.value2 = 0;
        component['calculate']();

        expect(component.result2).toBe(0); // Should not throw error, returns 0
    });

    it('should handle zero division for result3', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.value1 = 0;
        component.value2 = 50;
        component['calculate']();

        expect(component.result3).toBe(0); // Should not throw error, returns 0
    });

    it('should calculate with decimal values', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        
        component.percentage = 15.5;
        component.value2 = 200;
        component['calculate']();

        expect(component.result1).toBe(31); // 15.5% of 200 = 31
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
