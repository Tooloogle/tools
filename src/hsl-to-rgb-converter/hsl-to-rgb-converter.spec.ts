import { LitElement } from 'lit';
import { HslToRgbConverter } from "./hsl-to-rgb-converter.js";

describe('hsl-to-rgb-converter web component test', () => {

    const componentTag = "hsl-to-rgb-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HslToRgbConverter', () => {
        const component = window.document.createElement(componentTag) as HslToRgbConverter;
        expect(component).toBeInstanceOf(HslToRgbConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
