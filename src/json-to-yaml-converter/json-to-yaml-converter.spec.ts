import { LitElement } from 'lit';
import { JsonToYamlConverter } from "./json-to-yaml-converter.js";

describe('json-to-yaml-converter web component test', () => {

    const componentTag = "json-to-yaml-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToYamlConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToYamlConverter;
        expect(component).toBeInstanceOf(JsonToYamlConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
