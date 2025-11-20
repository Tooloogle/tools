import { LitElement } from 'lit';
import { CssUnitConverter } from "./css-unit-converter.js";

describe('css-unit-converter web component test', () => {

    const componentTag = "css-unit-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CssUnitConverter', () => {
        const component = window.document.createElement(componentTag) as CssUnitConverter;
        expect(component).toBeInstanceOf(CssUnitConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
