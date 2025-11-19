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

    it('should have initial zero counts', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        expect(component.wordCount).toBe(0);
        expect(component.charCount).toBe(0);
        expect(component.charCountNoSpaces).toBe(0);
        expect(component.lineCount).toBe(0);
        expect(component.sentenceCount).toBe(0);
        expect(component.paragraphCount).toBe(0);
    });

    it('should count words correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello World Test';
        component['updateCounts']();
        
        expect(component.wordCount).toBe(3);
    });

    it('should count characters correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello World';
        component['updateCounts']();
        
        expect(component.charCount).toBe(11); // Including space
    });

    it('should count characters without spaces correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello World';
        component['updateCounts']();
        
        expect(component.charCountNoSpaces).toBe(10); // Without space
    });

    it('should count lines correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Line 1\nLine 2\nLine 3';
        component['updateCounts']();
        
        expect(component.lineCount).toBe(3);
    });

    it('should count sentences correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello. How are you? I am fine!';
        component['updateCounts']();
        
        expect(component.sentenceCount).toBe(3);
    });

    it('should count paragraphs correctly', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
        component['updateCounts']();
        
        expect(component.paragraphCount).toBe(3);
    });

    it('should handle empty text', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = '';
        component['updateCounts']();
        
        expect(component.wordCount).toBe(0);
        expect(component.charCount).toBe(0);
        expect(component.lineCount).toBe(0);
        expect(component.sentenceCount).toBe(0);
    });

    it('should handle text with multiple spaces', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello    World';
        component['updateCounts']();
        
        expect(component.wordCount).toBe(2);
    });

    it('should handle single word', () => {
        const component = window.document.createElement(componentTag) as WordCounter;
        component.text = 'Hello';
        component['updateCounts']();
        
        expect(component.wordCount).toBe(1);
        expect(component.charCount).toBe(5);
        expect(component.lineCount).toBe(1);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
