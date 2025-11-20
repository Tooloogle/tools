import { LitElement } from 'lit';
import { PalindromeChecker } from "./palindrome-checker.js";

describe('palindrome-checker web component test', () => {

    const componentTag = "palindrome-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PalindromeChecker', () => {
        const component = window.document.createElement(componentTag) as PalindromeChecker;
        expect(component).toBeInstanceOf(PalindromeChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
