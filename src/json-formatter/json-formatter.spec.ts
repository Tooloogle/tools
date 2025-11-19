import { LitElement } from 'lit';
import { JsonFormatter } from "./json-formatter.js";

describe('json-formatter web component test', () => {

    const componentTag = "json-formatter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonFormatter', () => {
        const component = window.document.createElement(componentTag) as JsonFormatter;
        expect(component).toBeInstanceOf(JsonFormatter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
