import { LitElement } from 'lit';
import { XmlToYamlConverter } from "./xml-to-yaml-converter.js";

describe('xml-to-yaml-converter web component test', () => {

    const componentTag = "xml-to-yaml-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of XmlToYamlConverter', () => {
        const component = window.document.createElement(componentTag) as XmlToYamlConverter;
        expect(component).toBeInstanceOf(XmlToYamlConverter);
    });

    describe('XML -> YAML conversion', () => {
        let component: XmlToYamlConverter;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as XmlToYamlConverter;
            document.body.appendChild(component);
        });

        const convert = (xml: string): string => {
            component.inputText = xml;
            (component as unknown as { process: () => void }).process();
            return component.outputText;
        };

        it('aggregates duplicate tags into an array even when the first value is empty', () => {
            // Bug: previously `if (obj[key])` treated the empty-string first
            // value as falsy and overwrote it with the second value instead
            // of producing an array.
            const yamlOut = convert('<root><item></item><item>second</item></root>');
            // js-yaml emits arrays as block sequences with `-` items; the
            // empty first item appears as `null` (or empty), the second as 'second'.
            expect(yamlOut).toMatch(/item:\s*\n\s*-\s*('?'?|null|~)\s*\n\s*-\s*second/);
        });

        it('returns empty output for empty/whitespace input', () => {
            expect(convert('')).toBe('');
            expect(convert('   \n\t')).toBe('');
        });

        it('handles nested elements', () => {
            const out = convert('<root><user><name>Alice</name></user></root>');
            expect(out).toMatch(/user:\s*\n\s+name:\s*Alice/);
        });

        it('surfaces an Error: prefix when XML is invalid', () => {
            expect(convert('<unclosed>')).toMatch(/^Error:/);
        });

        it('drops attributes (pinned current limitation)', () => {
            // Known limitation: XML attributes are not preserved. If we ever
            // change this, update both the implementation and this test.
            const out = convert('<book id="42">Dune</book>');
            expect(out).not.toContain('42');
            expect(out).toMatch(/Dune/);
        });

        it('drops mixed-content text siblings (pinned current limitation)', () => {
            // Known limitation: only child elements are walked; raw text
            // around child elements is discarded.
            const out = convert('<p>hello <b>world</b>!</p>');
            expect(out).toMatch(/b:\s*world/);
            expect(out).not.toMatch(/hello/);
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
