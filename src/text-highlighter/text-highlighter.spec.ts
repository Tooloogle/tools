import { LitElement } from 'lit';
import { TextHighlighter } from "./text-highlighter.js";

describe('text-highlighter web component test', () => {

    const componentTag = "text-highlighter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextHighlighter', () => {
        const component = window.document.createElement(componentTag) as TextHighlighter;
        expect(component).toBeInstanceOf(TextHighlighter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
