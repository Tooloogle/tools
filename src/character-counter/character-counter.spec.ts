import { LitElement } from 'lit';
import { CharacterCounter } from "./character-counter.js";

describe('character-counter web component test', () => {

    const componentTag = "character-counter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CharacterCounter', () => {
        const component = window.document.createElement(componentTag) as CharacterCounter;
        expect(component).toBeInstanceOf(CharacterCounter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
