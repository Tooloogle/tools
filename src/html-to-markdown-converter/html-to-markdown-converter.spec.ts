import { LitElement } from 'lit';
import { HtmlToMarkdownConverter } from "./html-to-markdown-converter.js";

describe('html-to-markdown-converter web component test', () => {

    const componentTag = "html-to-markdown-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlToMarkdownConverter', () => {
        const component = window.document.createElement(componentTag) as HtmlToMarkdownConverter;
        expect(component).toBeInstanceOf(HtmlToMarkdownConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
