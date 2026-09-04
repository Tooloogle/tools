import { LitElement } from 'lit';
import { CssColorConverter } from "./css-color-converter.js";

describe('css-color-converter web component test', () => {

    const componentTag = "css-color-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssColorConverter', () => {
        const component = window.document.createElement(componentTag) as CssColorConverter;
        expect(component).toBeInstanceOf(CssColorConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
