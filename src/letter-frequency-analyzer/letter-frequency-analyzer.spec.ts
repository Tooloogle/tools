import { LitElement } from 'lit';
import { LetterFrequencyAnalyzer } from "./letter-frequency-analyzer.js";

describe('letter-frequency-analyzer web component test', () => {

    const componentTag = "letter-frequency-analyzer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LetterFrequencyAnalyzer', () => {
        const component = window.document.createElement(componentTag) as LetterFrequencyAnalyzer;
        expect(component).toBeInstanceOf(LetterFrequencyAnalyzer);
    });

    it('should have empty text by default', () => {
        const component = window.document.createElement(componentTag) as LetterFrequencyAnalyzer;
        expect(component.text).toBe('');
    });

    it('should have empty frequencies by default', () => {
        const component = window.document.createElement(componentTag) as LetterFrequencyAnalyzer;
        expect(component.frequencies.length).toBe(0);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
