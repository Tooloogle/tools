import { LitElement } from 'lit';
import { RegexPatternLibrary } from "./regex-pattern-library.js";

describe('regex-pattern-library web component test', () => {

    const componentTag = "regex-pattern-library";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RegexPatternLibrary', () => {
        const component = window.document.createElement(componentTag) as RegexPatternLibrary;
        expect(component).toBeInstanceOf(RegexPatternLibrary);
    });

    it('should have empty search term by default', () => {
        const component = window.document.createElement(componentTag) as RegexPatternLibrary;
        expect(component.searchTerm).toBe('');
    });

    it('should have all category selected by default', () => {
        const component = window.document.createElement(componentTag) as RegexPatternLibrary;
        expect(component.selectedCategory).toBe('all');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
