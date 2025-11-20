import { LitElement } from 'lit';
import { Sha512HashGenerator } from "./sha512-hash-generator.js";

describe('sha512-hash-generator web component test', () => {

    const componentTag = "sha512-hash-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Sha512HashGenerator', () => {
        const component = window.document.createElement(componentTag) as Sha512HashGenerator;
        expect(component).toBeInstanceOf(Sha512HashGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
