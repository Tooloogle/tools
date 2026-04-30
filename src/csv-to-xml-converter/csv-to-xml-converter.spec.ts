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

        it('emits empty cells as empty elements', () => {
            const xml = convert('name,age\nAlice,');
            expect(xml).toContain('<age></age>');
        });

        it('prefixes column names that do not start with a letter/underscore', () => {
            const xml = convert('1st,name\n42,Alice');
            expect(xml).toContain('<_1st>42</_1st>');
        });

        it('produces duplicate sibling elements when two headers sanitize to the same name (pinned behavior)', () => {
            // Both `first name` and `first/name` collapse to `first_name`. We
            // accept this and emit two siblings; a future change should be
            // intentional.
            const xml = convert('first name,first/name\nA,B');
            const matches = xml.match(/<first_name>/g) || [];
            expect(matches.length).toBe(2);
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
