import { LitElement } from 'lit';
import { CssBoxShadowGenerator } from "./css-box-shadow-generator.js";

describe('css-box-shadow-generator web component test', () => {

    const componentTag = "css-box-shadow-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssBoxShadowGenerator', () => {
        const component = window.document.createElement(componentTag) as CssBoxShadowGenerator;
        expect(component).toBeInstanceOf(CssBoxShadowGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
