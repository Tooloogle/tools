import { LitElement } from 'lit';
import { LeapYearChecker } from "./leap-year-checker.js";

describe('leap-year-checker web component test', () => {

    const componentTag = "leap-year-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LeapYearChecker', () => {
        const component = window.document.createElement(componentTag) as LeapYearChecker;
        expect(component).toBeInstanceOf(LeapYearChecker);
    });

    it('should have current year as default after connection', async () => {
        const component = window.document.createElement(componentTag) as LeapYearChecker;
        document.body.appendChild(component);
        await component.updateComplete;
        
        const currentYear = new Date().getFullYear();
        expect(component.year).toBe(currentYear);
    });

    it('should not be checked initially', () => {
        const component = window.document.createElement(componentTag) as LeapYearChecker;
        expect(component.checked).toBe(false);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
