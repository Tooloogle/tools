import { LitElement } from 'lit';
import { MarkdownToHtmlConverter } from "./markdown-to-html-converter.js";

describe('markdown-to-html-converter web component test', () => {

    const componentTag = "markdown-to-html-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MarkdownToHtmlConverter', () => {
        const component = window.document.createElement(componentTag) as MarkdownToHtmlConverter;
        expect(component).toBeInstanceOf(MarkdownToHtmlConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
