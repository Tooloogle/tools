import { LitElement } from 'lit';
import { TimezoneOffsetCalculator } from "./timezone-offset-calculator.js";

describe('timezone-offset-calculator web component test', () => {

    const componentTag = "timezone-offset-calculator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TimezoneOffsetCalculator', () => {
        const component = window.document.createElement(componentTag) as TimezoneOffsetCalculator;
        expect(component).toBeInstanceOf(TimezoneOffsetCalculator);
    });

    it('should have UTC as default from timezone', () => {
        const component = window.document.createElement(componentTag) as TimezoneOffsetCalculator;
        expect(component.fromTimezone).toBe('UTC');
    });

    it('should have America/New_York as default to timezone', () => {
        const component = window.document.createElement(componentTag) as TimezoneOffsetCalculator;
        expect(component.toTimezone).toBe('America/New_York');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
