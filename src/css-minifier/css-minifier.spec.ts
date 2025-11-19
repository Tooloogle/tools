import { LitElement } from 'lit';
import { CssMinifier } from "./css-minifier.js";

describe('css-minifier web component test', () => {

    const componentTag = "css-minifier";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssMinifier', () => {
        const component = window.document.createElement(componentTag) as CssMinifier;
        expect(component).toBeInstanceOf(CssMinifier);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
