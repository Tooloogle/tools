import { LitElement } from 'lit';
import { Sha256HashGenerator } from "./sha256-hash-generator.js";

describe('sha256-hash-generator web component test', () => {

    const componentTag = "sha256-hash-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Sha256HashGenerator', () => {
        const component = window.document.createElement(componentTag) as Sha256HashGenerator;
        expect(component).toBeInstanceOf(Sha256HashGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
