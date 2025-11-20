import { LitElement } from 'lit';
import { XmlToCsvConverter } from "./xml-to-csv-converter.js";

describe('xml-to-csv-converter web component test', () => {

    const componentTag = "xml-to-csv-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of XmlToCsvConverter', () => {
        const component = window.document.createElement(componentTag) as XmlToCsvConverter;
        expect(component).toBeInstanceOf(XmlToCsvConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
