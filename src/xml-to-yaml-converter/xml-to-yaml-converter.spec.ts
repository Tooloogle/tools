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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
