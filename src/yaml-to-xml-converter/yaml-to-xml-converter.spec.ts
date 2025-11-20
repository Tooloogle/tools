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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
