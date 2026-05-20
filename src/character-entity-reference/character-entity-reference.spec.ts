import { LitElement } from 'lit';
import { CharacterEntityReference } from "./character-entity-reference.js";

describe('character-entity-reference web component test', () => {

    const componentTag = "character-entity-reference";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CharacterEntityReference', () => {
        const component = window.document.createElement(componentTag) as CharacterEntityReference;
        expect(component).toBeInstanceOf(CharacterEntityReference);
    });

    it('should have empty search term by default', () => {
        const component = window.document.createElement(componentTag) as CharacterEntityReference;
        expect(component.searchTerm).toBe('');
    });

    it('should have all category selected by default', () => {
        const component = window.document.createElement(componentTag) as CharacterEntityReference;
        expect(component.selectedCategory).toBe('all');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
