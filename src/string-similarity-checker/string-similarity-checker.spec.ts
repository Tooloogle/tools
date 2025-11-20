import { LitElement } from 'lit';
import { StringSimilarityChecker } from "./string-similarity-checker.js";

describe('string-similarity-checker web component test', () => {

    const componentTag = "string-similarity-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of StringSimilarityChecker', () => {
        const component = window.document.createElement(componentTag) as StringSimilarityChecker;
        expect(component).toBeInstanceOf(StringSimilarityChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
