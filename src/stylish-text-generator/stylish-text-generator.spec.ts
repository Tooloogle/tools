import { LitElement } from 'lit';
import { StylishTextGenerator } from "./stylish-text-generator.js";

describe('stylish-text-generator web component test', () => {

    const componentTag = "stylish-text-generator";
    
    it('should be an instance of StylishTextGenerator', () => {
        const component = window.document.createElement(componentTag) as StylishTextGenerator;
        expect(component).toBeInstanceOf(StylishTextGenerator);
    });

    it('should have default text property', () => {
        const component = window.document.createElement(componentTag) as StylishTextGenerator;
        expect(component.text).toBe('Stylish Text');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
