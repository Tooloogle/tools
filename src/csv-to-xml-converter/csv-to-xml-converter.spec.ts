import { LitElement } from 'lit';
import { CsvToXmlConverter } from "./csv-to-xml-converter.js";

describe('csv-to-xml-converter web component test', () => {

    const componentTag = "csv-to-xml-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CsvToXmlConverter', () => {
        const component = window.document.createElement(componentTag) as CsvToXmlConverter;
        expect(component).toBeInstanceOf(CsvToXmlConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
