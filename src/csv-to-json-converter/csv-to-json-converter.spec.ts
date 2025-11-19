import { LitElement } from 'lit';
import { CsvToJsonConverter } from "./csv-to-json-converter.js";

describe('csv-to-json-converter web component test', () => {

    const componentTag = "csv-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CsvToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as CsvToJsonConverter;
        expect(component).toBeInstanceOf(CsvToJsonConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
