import { LitElement } from 'lit';
import { Md5HashGenerator } from "./md5-hash-generator.js";

describe('md5-hash-generator web component test', () => {

    const componentTag = "md5-hash-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Md5HashGenerator', () => {
        const component = window.document.createElement(componentTag) as Md5HashGenerator;
        expect(component).toBeInstanceOf(Md5HashGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
