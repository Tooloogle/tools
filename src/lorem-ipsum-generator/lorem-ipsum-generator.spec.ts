import { LitElement } from 'lit';
import { LoremIpsumGenerator } from "./lorem-ipsum-generator.js";

describe('lorem-ipsum-generator web component test', () => {

    const componentTag = "lorem-ipsum-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LoremIpsumGenerator', () => {
        const component = window.document.createElement(componentTag) as LoremIpsumGenerator;
        expect(component).toBeInstanceOf(LoremIpsumGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
