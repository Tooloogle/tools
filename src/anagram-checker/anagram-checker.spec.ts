import { LitElement } from 'lit';
import { AnagramChecker } from "./anagram-checker.js";

describe('anagram-checker web component test', () => {

    const componentTag = "anagram-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AnagramChecker', () => {
        const component = window.document.createElement(componentTag) as AnagramChecker;
        expect(component).toBeInstanceOf(AnagramChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
