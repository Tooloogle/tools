import { LitElement } from 'lit';
import { YamlToXmlConverter } from "./yaml-to-xml-converter.js";

describe('yaml-to-xml-converter web component test', () => {

    const componentTag = "yaml-to-xml-converter";

    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of YamlToXmlConverter', () => {
        const component = window.document.createElement(componentTag) as YamlToXmlConverter;
        expect(component).toBeInstanceOf(YamlToXmlConverter);
    });

    describe('YAML -> XML conversion', () => {
        let component: YamlToXmlConverter;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as YamlToXmlConverter;
            document.body.appendChild(component);
        });

        const convert = (yamlText: string): string => {
            component.inputText = yamlText;
            (component as unknown as { process: () => void }).process();
            return component.outputText;
        };

        it('escapes XML entities in values', () => {
            expect(convert('msg: "Tom & Jerry <3>"'))
                .toBe('<root><msg>Tom &amp; Jerry &lt;3&gt;</msg></root>');
        });

        it('wraps array of primitives in a single <item> element', () => {
            expect(convert('items:\n  - a\n  - b'))
                .toBe('<root><items><item>a</item><item>b</item></items></root>');
        });

        it('wraps array of objects with a single <item> per element (no double wrap)', () => {
            expect(convert('items:\n  - id: 1\n  - id: 2'))
                .toBe('<root><items><item><id>1</id></item><item><id>2</id></item></items></root>');
        });

        it('sanitizes invalid characters in tag names', () => {
            expect(convert('"first name": Alice'))
                .toBe('<root><first_name>Alice</first_name></root>');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

