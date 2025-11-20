import { LitElement } from 'lit';
import { CamelCaseConverter } from "./camel-case-converter.js";

describe('camel-case-converter web component test', () => {

    const componentTag = "camel-case-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CamelCaseConverter', () => {
        const component = window.document.createElement(componentTag) as CamelCaseConverter;
        expect(component).toBeInstanceOf(CamelCaseConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
