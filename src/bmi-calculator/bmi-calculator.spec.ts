import { LitElement } from 'lit';
import { BmiCalculator } from "./bmi-calculator.js";
import { calculateBMIValue, getBMICategory, validateInput } from "./bmi-calculator-utils.js";

describe('bmi-calculator web component test', () => {

    const componentTag = "bmi-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BmiCalculator', () => {
        const component = window.document.createElement(componentTag) as BmiCalculator;
        expect(component).toBeInstanceOf(BmiCalculator);
    });

    it('should have initial zero values', () => {
        const component = window.document.createElement(componentTag) as BmiCalculator;
        expect(component.height).toBe(0);
        expect(component.weight).toBe(0);
        expect(component.bmi).toBe(0);
        expect(component.category).toBe('');
    });

    describe('BMI calculation utility functions', () => {
        it('should calculate BMI correctly for metric units', () => {
            const bmi = calculateBMIValue(170, 70, 'metric'); // 170cm, 70kg
            expect(bmi).toBeCloseTo(24.2, 1);
        });

        it('should calculate BMI correctly for imperial units', () => {
            const bmi = calculateBMIValue(5.58, 154, 'imperial'); // 5.58ft, 154lbs
            expect(bmi).toBeCloseTo(24.1, 1);
        });

        it('should categorize BMI as Underweight', () => {
            expect(getBMICategory(17)).toBe('Underweight');
            expect(getBMICategory(18.4)).toBe('Underweight');
        });

        it('should categorize BMI as Normal weight', () => {
            expect(getBMICategory(18.5)).toBe('Normal weight');
            expect(getBMICategory(22)).toBe('Normal weight');
            expect(getBMICategory(24.9)).toBe('Normal weight');
        });

        it('should categorize BMI as Overweight', () => {
            expect(getBMICategory(25)).toBe('Overweight');
            expect(getBMICategory(27)).toBe('Overweight');
            expect(getBMICategory(29.9)).toBe('Overweight');
        });

        it('should categorize BMI as Obese', () => {
            expect(getBMICategory(30)).toBe('Obese');
            expect(getBMICategory(35)).toBe('Obese');
            expect(getBMICategory(40)).toBe('Obese');
        });

        it('should validate height correctly for metric units', () => {
            expect(validateInput(170, 'height', 'metric').isValid).toBe(true);
            expect(validateInput(30, 'height', 'metric').isValid).toBe(false);
            expect(validateInput(300, 'height', 'metric').isValid).toBe(false);
        });

        it('should validate height correctly for imperial units', () => {
            expect(validateInput(5.5, 'height', 'imperial').isValid).toBe(true);
            expect(validateInput(1, 'height', 'imperial').isValid).toBe(false);
            expect(validateInput(10, 'height', 'imperial').isValid).toBe(false);
        });

        it('should validate weight correctly for metric units', () => {
            expect(validateInput(70, 'weight', 'metric').isValid).toBe(true);
            expect(validateInput(5, 'weight', 'metric').isValid).toBe(false);
            expect(validateInput(600, 'weight', 'metric').isValid).toBe(false);
        });

        it('should validate weight correctly for imperial units', () => {
            expect(validateInput(150, 'weight', 'imperial').isValid).toBe(true);
            expect(validateInput(10, 'weight', 'imperial').isValid).toBe(false);
            expect(validateInput(1200, 'weight', 'imperial').isValid).toBe(false);
        });

        it('should reject negative or zero values', () => {
            expect(validateInput(0, 'height', 'metric').isValid).toBe(false);
            expect(validateInput(-10, 'weight', 'metric').isValid).toBe(false);
        });

        it('should reject NaN values', () => {
            expect(validateInput(NaN, 'height', 'metric').isValid).toBe(false);
            expect(validateInput(NaN, 'weight', 'metric').isValid).toBe(false);
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
