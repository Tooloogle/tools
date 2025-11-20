import { LitElement } from 'lit';
import { CssTextShadowGenerator } from "./css-text-shadow-generator.js";

describe('css-text-shadow-generator web component test', () => {

    const componentTag = "css-text-shadow-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssTextShadowGenerator', () => {
        const component = window.document.createElement(componentTag) as CssTextShadowGenerator;
        expect(component).toBeInstanceOf(CssTextShadowGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
