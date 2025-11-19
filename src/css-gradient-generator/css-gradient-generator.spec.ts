import { LitElement } from 'lit';
import { CssGradientGenerator } from "./css-gradient-generator.js";

describe('css-gradient-generator web component test', () => {

    const componentTag = "css-gradient-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssGradientGenerator', () => {
        const component = window.document.createElement(componentTag) as CssGradientGenerator;
        expect(component).toBeInstanceOf(CssGradientGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
