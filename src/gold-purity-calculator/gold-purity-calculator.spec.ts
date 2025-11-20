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

    it('should initialize with default values', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        
        await component.updateComplete;

        expect(component.karat).toBe(24);
        expect(component.purity).toBe(100);
        expect(component.weight).toBe(0);
        expect(component.pricePerGram).toBe(0);
    });

    it('should calculate purity from karat', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        const input = component.shadowRoot?.querySelector('input[placeholder="Karat"]') as HTMLInputElement;
        if (input) {
            input.value = '18';
            input.dispatchEvent(new Event('change'));
            await component.updateComplete;

            expect(component.karat).toBe(18);
            expect(component.purity).toBeCloseTo(75, 2);
        }
    });

    it('should calculate karat from purity', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        const input = component.shadowRoot?.querySelector('input[placeholder="Purity"]') as HTMLInputElement;
        if (input) {
            input.value = '75';
            input.dispatchEvent(new Event('change'));
            await component.updateComplete;

            expect(component.purity).toBe(75);
            expect(component.karat).toBeCloseTo(18, 2);
        }
    });

    it('should calculate total price correctly', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        // Set weight and price manually for predictable testing
        component.weight = 10; // 10 grams
        component.pricePerGram = 70; // $70 per gram
        component.purity = 100; // 100% pure
        component.calculateTotalPrice();
        await component.updateComplete;

        // Total should be 10 * 70 * 1.0 = 700
        expect(component.totalPrice).toBe(700);
    });

    it('should adjust price based on purity', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        component.weight = 10; // 10 grams
        component.pricePerGram = 70; // $70 per gram
        component.purity = 75; // 75% pure (18k)
        component.calculateTotalPrice();
        await component.updateComplete;

        // Total should be 10 * 70 * 0.75 = 525
        expect(component.totalPrice).toBe(525);
    });

    it('should return zero price when weight is zero', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        component.weight = 0;
        component.pricePerGram = 70;
        component.purity = 100;
        component.calculateTotalPrice();
        await component.updateComplete;

        expect(component.totalPrice).toBe(0);
    });

    it('should return zero price when price per gram is zero', async () => {
        const component = window.document.createElement(componentTag) as GoldPurityCalculator;
        document.body.appendChild(component);
        await component.updateComplete;

        component.weight = 10;
        component.pricePerGram = 0;
        component.purity = 100;
        component.calculateTotalPrice();
        await component.updateComplete;

        expect(component.totalPrice).toBe(0);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
