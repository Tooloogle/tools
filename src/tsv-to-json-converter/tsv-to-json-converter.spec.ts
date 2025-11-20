import { LitElement } from 'lit';
import { TsvToJsonConverter } from "./tsv-to-json-converter.js";

describe('tsv-to-json-converter web component test', () => {

    const componentTag = "tsv-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TsvToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as TsvToJsonConverter;
        expect(component).toBeInstanceOf(TsvToJsonConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
