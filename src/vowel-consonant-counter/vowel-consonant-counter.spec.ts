import { LitElement } from 'lit';
import { VowelConsonantCounter } from "./vowel-consonant-counter.js";

describe('vowel-consonant-counter web component test', () => {

    const componentTag = "vowel-consonant-counter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of VowelConsonantCounter', () => {
        const component = window.document.createElement(componentTag) as VowelConsonantCounter;
        expect(component).toBeInstanceOf(VowelConsonantCounter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
