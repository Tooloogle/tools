import { LitElement } from 'lit';
import { WordCounter } from "./word-counter.js";

describe('word-counter web component test', () => {

    const componentTag = "word-counter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WordCounter', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        expect(component).toBeInstanceOf(WordCounter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
