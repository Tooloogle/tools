import { LitElement } from 'lit';
import { WordScrambler } from "./word-scrambler.js";

describe('word-scrambler web component test', () => {

    const componentTag = "word-scrambler";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WordScrambler', () => {
        const component = window.document.createElement(componentTag) as WordScrambler;
        expect(component).toBeInstanceOf(WordScrambler);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
