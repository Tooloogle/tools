import { LitElement } from 'lit';
import { YamlValidator } from "./yaml-validator.js";

describe('yaml-validator web component test', () => {

    const componentTag = "yaml-validator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of YamlValidator', () => {
        const component = window.document.createElement(componentTag) as YamlValidator;
        expect(component).toBeInstanceOf(YamlValidator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
