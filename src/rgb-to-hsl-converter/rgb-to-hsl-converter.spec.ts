import { LitElement } from 'lit';
import { RgbToHslConverter } from "./rgb-to-hsl-converter.js";

describe('rgb-to-hsl-converter web component test', () => {

    const componentTag = "rgb-to-hsl-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RgbToHslConverter', () => {
        const component = window.document.createElement(componentTag) as RgbToHslConverter;
        expect(component).toBeInstanceOf(RgbToHslConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
