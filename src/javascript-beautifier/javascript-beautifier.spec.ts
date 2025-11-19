import { LitElement } from 'lit';
import { JavascriptBeautifier } from "./javascript-beautifier.js";

describe('javascript-beautifier web component test', () => {

    const componentTag = "javascript-beautifier";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JavascriptBeautifier', () => {
        const component = window.document.createElement(componentTag) as JavascriptBeautifier;
        expect(component).toBeInstanceOf(JavascriptBeautifier);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
