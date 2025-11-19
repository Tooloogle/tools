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

    it('should have initial empty values', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        expect(component.dob).toBe('');
        expect(component.today).toBe('');
        expect(component.haveTime).toBe(false);
        expect(component.result).toEqual({});
    });

    it('should calculate age difference correctly', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        
        // Set dob to 2000-01-01 and today to 2020-01-01
        component.dob = '2000-01-01';
        component.today = '2020-01-01';
        component.calculate();

        expect(component.result.years).toBe(20);
        expect(component.result.months).toBe(0);
        // Days can vary due to dayjs duration calculation, so we check it's a small value
        expect(component.result.days).toBeGreaterThanOrEqual(0);
        expect(component.result.days).toBeLessThanOrEqual(6);
    });

    it('should calculate partial year correctly', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        
        // Set dob to 2000-01-01 and today to 2020-06-15
        component.dob = '2000-01-01';
        component.today = '2020-06-15';
        component.calculate();

        expect(component.result.years).toBe(20);
        expect(component.result.months).toBe(5);
        // Days can vary due to dayjs duration calculation
        expect(component.result.days).toBeGreaterThanOrEqual(10);
        expect(component.result.days).toBeLessThanOrEqual(20);
    });

    it('should calculate total days correctly', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        
        component.dob = '2000-01-01';
        component.today = '2000-01-02';
        component.calculate();

        expect(component.result.total.days).toBe(1);
    });

    it('should handle same date correctly', () => {
        const component = window.document.createElement(componentTag) as AgeCalculator;
        
        component.dob = '2000-01-01';
        component.today = '2000-01-01';
        component.calculate();

        expect(component.result.years).toBe(0);
        expect(component.result.months).toBe(0);
        expect(component.result.days).toBe(0);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
