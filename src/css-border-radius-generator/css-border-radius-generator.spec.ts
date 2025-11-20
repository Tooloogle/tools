import { LitElement } from 'lit';
import { CssBorderRadiusGenerator } from "./css-border-radius-generator.js";

describe('css-border-radius-generator web component test', () => {

    const componentTag = "css-border-radius-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssBorderRadiusGenerator', () => {
        const component = window.document.createElement(componentTag) as CssBorderRadiusGenerator;
        expect(component).toBeInstanceOf(CssBorderRadiusGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
