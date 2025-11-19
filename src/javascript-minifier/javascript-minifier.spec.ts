import { LitElement } from 'lit';
import { JavascriptMinifier } from "./javascript-minifier.js";

describe('javascript-minifier web component test', () => {

    const componentTag = "javascript-minifier";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JavascriptMinifier', () => {
        const component = window.document.createElement(componentTag) as JavascriptMinifier;
        expect(component).toBeInstanceOf(JavascriptMinifier);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
