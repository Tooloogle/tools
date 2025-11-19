import { LitElement } from 'lit';
import { MarkdownPreviewer } from "./markdown-previewer.js";

describe('markdown-previewer web component test', () => {

    const componentTag = "markdown-previewer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MarkdownPreviewer', () => {
        const component = window.document.createElement(componentTag) as MarkdownPreviewer;
        expect(component).toBeInstanceOf(MarkdownPreviewer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
