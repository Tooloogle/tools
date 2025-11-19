import { LitElement } from 'lit';
import { JsonToCsvConverter } from "./json-to-csv-converter.js";

describe('json-to-csv-converter web component test', () => {

    const componentTag = "json-to-csv-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToCsvConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToCsvConverter;
        expect(component).toBeInstanceOf(JsonToCsvConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
