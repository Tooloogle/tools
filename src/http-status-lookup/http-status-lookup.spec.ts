import { LitElement } from 'lit';
import { HttpStatusLookup } from "./http-status-lookup.js";

describe('http-status-lookup web component test', () => {

    const componentTag = "http-status-lookup";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HttpStatusLookup', () => {
        const component = window.document.createElement(componentTag) as HttpStatusLookup;
        expect(component).toBeInstanceOf(HttpStatusLookup);
    });

    it('should have empty search term by default', () => {
        const component = window.document.createElement(componentTag) as HttpStatusLookup;
        expect(component.searchTerm).toBe('');
    });

    it('should have all category selected by default', () => {
        const component = window.document.createElement(componentTag) as HttpStatusLookup;
        expect(component.selectedCategory).toBe('all');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
