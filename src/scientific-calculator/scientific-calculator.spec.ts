import { LitElement } from 'lit';
import { ScientificCalculator } from "./scientific-calculator.js";

describe('scientific-calculator web component test', () => {

    const componentTag = "scientific-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ScientificCalculator', () => {
        const component = window.document.createElement(componentTag) as ScientificCalculator;
        expect(component).toBeInstanceOf(ScientificCalculator);
    });

    describe('expression evaluation', () => {
        let component: ScientificCalculator;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as ScientificCalculator;
        });

        function evaluate(expr: string): string {
            component.inputText = expr;
            component['process']();
            return component.outputText;
        }

        it('should evaluate basic arithmetic', () => {
            expect(evaluate('2+3')).toBe('5');
            expect(evaluate('10-4')).toBe('6');
            expect(evaluate('3*7')).toBe('21');
            expect(evaluate('15/3')).toBe('5');
        });

        it('should respect operator precedence', () => {
            expect(evaluate('2+3*4')).toBe('14');
            expect(evaluate('2*3+4')).toBe('10');
            expect(evaluate('(2+3)*4')).toBe('20');
        });

        it('should handle exponentiation with right associativity', () => {
            expect(evaluate('2^3')).toBe('8');
            expect(evaluate('2^3^2')).toBe('512');
        });

        it('should handle unary minus vs exponentiation correctly', () => {
            expect(evaluate('-2^2')).toBe('-4');
            expect(evaluate('(-2)^2')).toBe('4');
        });

        it('should evaluate functions', () => {
            expect(evaluate('sqrt(16)')).toBe('4');
            expect(evaluate('abs(-5)')).toBe('5');
            expect(evaluate('ceil(2.1)')).toBe('3');
            expect(evaluate('floor(2.9)')).toBe('2');
            expect(evaluate('round(2.5)')).toBe('3');
        });

        it('should evaluate trig and log with constants', () => {
            expect(Number(evaluate('sin(pi/2)'))).toBeCloseTo(1);
            expect(Number(evaluate('cos(0)'))).toBeCloseTo(1);
            expect(Number(evaluate('tan(pi/4)'))).toBeCloseTo(1);
            expect(Number(evaluate('log(100)'))).toBeCloseTo(2);
            expect(Number(evaluate('ln(e)'))).toBeCloseTo(1);
        });

        it('should reject invalid expressions', () => {
            expect(evaluate('foo(1)')).toBe('Error: Invalid expression');
            expect(evaluate(')1+2(')).toBe('Error: Invalid expression');
            expect(evaluate('sqrt(')).toBe('Error: Invalid expression');
        });

        it('should return empty string for empty input', () => {
            expect(evaluate('')).toBe('');
            expect(evaluate('   ')).toBe('');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
