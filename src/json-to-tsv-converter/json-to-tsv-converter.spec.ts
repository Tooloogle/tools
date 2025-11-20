import { LitElement } from 'lit';
import { JsonToTsvConverter } from "./json-to-tsv-converter.js";

describe('json-to-tsv-converter web component test', () => {

    const componentTag = "json-to-tsv-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToTsvConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToTsvConverter;
        expect(component).toBeInstanceOf(JsonToTsvConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
