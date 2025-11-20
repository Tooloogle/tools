import { LitElement } from 'lit';
import { MorseCodeTranslator } from "./morse-code-translator.js";

describe('morse-code-translator web component test', () => {

    const componentTag = "morse-code-translator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MorseCodeTranslator', () => {
        const component = window.document.createElement(componentTag) as MorseCodeTranslator;
        expect(component).toBeInstanceOf(MorseCodeTranslator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
