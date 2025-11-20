import { LitElement } from 'lit';
import { LetterCounter } from "./letter-counter.js";

describe('letter-counter web component test', () => {

    const componentTag = "letter-counter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LetterCounter', () => {
        const component = window.document.createElement(componentTag) as LetterCounter;
        expect(component).toBeInstanceOf(LetterCounter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
