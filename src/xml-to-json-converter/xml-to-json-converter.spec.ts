import { LitElement } from 'lit';
import { XmlToJsonConverter } from "./xml-to-json-converter.js";

describe('xml-to-json-converter web component test', () => {

    const componentTag = "xml-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of XmlToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as XmlToJsonConverter;
        expect(component).toBeInstanceOf(XmlToJsonConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
