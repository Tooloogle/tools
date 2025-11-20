import { LitElement } from 'lit';
import { YamlToJsonConverter } from "./yaml-to-json-converter.js";

describe('yaml-to-json-converter web component test', () => {

    const componentTag = "yaml-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of YamlToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as YamlToJsonConverter;
        expect(component).toBeInstanceOf(YamlToJsonConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
