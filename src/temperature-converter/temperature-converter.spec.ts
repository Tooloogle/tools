import { LitElement } from 'lit';
import { TemperatureConverter } from "./temperature-converter.js";

describe('temperature-converter web component test', () => {

    const componentTag = "temperature-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TemperatureConverter', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        expect(component).toBeInstanceOf(TemperatureConverter);
    });

    it('should have initial temperature values', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        expect(component.c).toBe(0);
        expect(component.f).toBe(32);
        expect(component.k).toBe(273.15);
    });

    it('should convert Celsius to Fahrenheit and Kelvin correctly', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        
        // Simulate celsius change
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '100' } });
        component['onCelsiusChange'](event);

        expect(component.c).toBe(100);
        expect(component.f).toBe(212); // 100°C = 212°F
        expect(component.k).toBe(373.15); // 100°C = 373.15K
    });

    it('should convert Fahrenheit to Celsius and Kelvin correctly', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '32' } });
        component['onFahrenheitChange'](event);

        expect(component.f).toBe(32);
        expect(component.c).toBe(0); // 32°F = 0°C
        expect(component.k).toBeCloseTo(273.15, 2); // 32°F = 273.15K
    });

    it('should convert Kelvin to Celsius and Fahrenheit correctly', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '273.15' } });
        component['onKelvinChange'](event);

        expect(component.k).toBe(273.15);
        expect(component.c).toBe(0); // 273.15K = 0°C
        expect(component.f).toBeCloseTo(32, 2); // 273.15K = 32°F
    });

    it('should handle negative temperatures correctly', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '-40' } });
        component['onCelsiusChange'](event);

        expect(component.c).toBe(-40);
        expect(component.f).toBe(-40); // -40°C = -40°F (special case)
        expect(component.k).toBeCloseTo(233.15, 2);
    });

    it('should format numbers to 2 decimal places', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        
        expect(component.toNumber(123.456789)).toBe(123.46);
        expect(component.toNumber(100)).toBe(100);
        expect(component.toNumber(0.123)).toBe(0.12);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
