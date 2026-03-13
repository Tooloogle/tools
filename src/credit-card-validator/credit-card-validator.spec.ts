import { LitElement } from 'lit';
import { CreditCardValidator } from "./credit-card-validator.js";

describe('credit-card-validator web component test', () => {

    const componentTag = "credit-card-validator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CreditCardValidator', () => {
        const component = window.document.createElement(componentTag) as CreditCardValidator;
        expect(component).toBeInstanceOf(CreditCardValidator);
    });

    describe('card type detection', () => {
        let component: CreditCardValidator;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as CreditCardValidator;
        });

        function detectType(num: string): string {
            return component['detectCardType'](num);
        }

        it('should detect Visa', () => {
            expect(detectType('4111111111111111')).toBe('Visa');
        });

        it('should detect Mastercard 51xx-55xx range', () => {
            expect(detectType('5100000000000000')).toBe('Mastercard');
            expect(detectType('5500000000000000')).toBe('Mastercard');
        });

        it('should detect Mastercard 2221-2720 range boundaries', () => {
            expect(detectType('2221000000000000')).toBe('Mastercard');
            expect(detectType('2720000000000000')).toBe('Mastercard');
            expect(detectType('2500000000000000')).toBe('Mastercard');
        });

        it('should not detect Mastercard outside 2221-2720 range', () => {
            expect(detectType('2220000000000000')).not.toBe('Mastercard');
            expect(detectType('2721000000000000')).not.toBe('Mastercard');
        });

        it('should detect American Express', () => {
            expect(detectType('340000000000000')).toBe('American Express');
            expect(detectType('370000000000000')).toBe('American Express');
        });

        it('should detect Discover', () => {
            expect(detectType('6011000000000000')).toBe('Discover');
            expect(detectType('6500000000000000')).toBe('Discover');
        });

        it('should return Unknown for unrecognized prefixes', () => {
            expect(detectType('9999000000000000')).toBe('Unknown');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
