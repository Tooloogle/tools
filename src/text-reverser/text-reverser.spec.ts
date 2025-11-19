import { LitElement } from 'lit';
import { TextReverser } from "./text-reverser.js";

describe('text-reverser web component test', () => {

    const componentTag = "text-reverser";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextReverser', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        expect(component).toBeInstanceOf(TextReverser);
    });

    it('should have initial empty values', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        expect(component.input).toBe('');
        expect(component.output).toBe('');
    });

    it('should reverse text correctly', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'Hello World';
        component['reverseText']();
        
        expect(component.output).toBe('dlroW olleH');
    });

    it('should reverse words correctly', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'Hello World Test';
        component['reverseWords']();
        
        expect(component.output).toBe('Test World Hello');
    });

    it('should reverse lines correctly', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'Line 1\nLine 2\nLine 3';
        component['reverseLines']();
        
        expect(component.output).toBe('Line 3\nLine 2\nLine 1');
    });

    it('should reverse each word correctly', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'Hello World';
        component['reverseEachWord']();
        
        expect(component.output).toBe('olleH dlroW');
    });

    it('should clear input and output', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'Test';
        component.output = 'tseT';
        component['clear']();
        
        expect(component.input).toBe('');
        expect(component.output).toBe('');
    });

    it('should handle empty string', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = '';
        component['reverseText']();
        
        expect(component.output).toBe('');
    });

    it('should handle single character', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = 'A';
        component['reverseText']();
        
        expect(component.output).toBe('A');
    });

    it('should handle special characters', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        component.input = '!@#$%';
        component['reverseText']();
        
        expect(component.output).toBe('%$#@!');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
