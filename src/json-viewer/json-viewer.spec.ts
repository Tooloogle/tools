import { LitElement } from 'lit';
import { JsonViewer } from "./json-viewer.js";

describe('json-viewer web component test', () => {

    const componentTag = "json-viewer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonViewer', () => {
        const component = window.document.createElement(componentTag) as JsonViewer;
        expect(component).toBeInstanceOf(JsonViewer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
