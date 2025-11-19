import { LitElement } from 'lit';
import { CssBeautifier } from "./css-beautifier.js";

describe('css-beautifier web component test', () => {

    const componentTag = "css-beautifier";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssBeautifier', () => {
        const component = window.document.createElement(componentTag) as CssBeautifier;
        expect(component).toBeInstanceOf(CssBeautifier);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
