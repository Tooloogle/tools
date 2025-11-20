import { LitElement } from 'lit';
import { PrimeNumberChecker } from "./prime-number-checker.js";

describe('prime-number-checker web component test', () => {

    const componentTag = "prime-number-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PrimeNumberChecker', () => {
        const component = window.document.createElement(componentTag) as PrimeNumberChecker;
        expect(component).toBeInstanceOf(PrimeNumberChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
