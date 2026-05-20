import { LitElement } from 'lit';
import { ColorLuminanceCalculator } from "./color-luminance-calculator.js";

describe('color-luminance-calculator web component test', () => {

    const componentTag = "color-luminance-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ColorLuminanceCalculator', () => {
        const component = window.document.createElement(componentTag) as ColorLuminanceCalculator;
        expect(component).toBeInstanceOf(ColorLuminanceCalculator);
    });

    it('should have default color', () => {
        const component = window.document.createElement(componentTag) as ColorLuminanceCalculator;
        expect(component.color).toBe('#000000');
    });

    it('should calculate luminance for black', async () => {
        const component = window.document.createElement(componentTag) as ColorLuminanceCalculator;
        document.body.appendChild(component);
        await component.updateComplete;
        
        expect(component.luminance).toBe(0);
    });

    it('should calculate brightness for white', async () => {
        const component = window.document.createElement(componentTag) as ColorLuminanceCalculator;
        component.color = '#ffffff';
        document.body.appendChild(component);
        await component.updateComplete;
        
        expect(component.brightness).toBe(255);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
