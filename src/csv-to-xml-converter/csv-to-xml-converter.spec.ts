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

    describe('CSV -> XML conversion', () => {
        let component: CsvToXmlConverter;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as CsvToXmlConverter;
            document.body.appendChild(component);
        });

        const convert = (csv: string): string => {
            component.inputText = csv;
            (component as unknown as { process: () => void }).process();
            return component.outputText;
        };

        it('escapes XML entities in cell values', () => {
            const xml = convert('name,bio\nAlice,"Tom & <Jerry>"');
            expect(xml).toContain('<bio>Tom &amp; &lt;Jerry&gt;</bio>');
            expect(xml).not.toContain('Tom & <Jerry>');
        });

        it('sanitizes invalid characters in column names', () => {
            const xml = convert('first name,age\nAlice,30');
            expect(xml).toContain('<first_name>Alice</first_name>');
            expect(xml).not.toContain('<first name>');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
