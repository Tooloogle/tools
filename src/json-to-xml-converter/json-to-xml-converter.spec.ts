import { LitElement } from 'lit';
import { JsonToXmlConverter } from "./json-to-xml-converter.js";

describe('json-to-xml-converter web component test', () => {

    const componentTag = "json-to-xml-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToXmlConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToXmlConverter;
        expect(component).toBeInstanceOf(JsonToXmlConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
