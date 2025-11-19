import { LitElement } from 'lit';
import { HtmlBeautifier } from "./html-beautifier.js";

describe('html-beautifier web component test', () => {

    const componentTag = "html-beautifier";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlBeautifier', () => {
        const component = window.document.createElement(componentTag) as HtmlBeautifier;
        expect(component).toBeInstanceOf(HtmlBeautifier);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
