import { LitElement } from 'lit';
import { HexToRgbaConverter } from "./hex-to-rgba-converter.js";

describe('hex-to-rgba-converter web component test', () => {

    const componentTag = "hex-to-rgba-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HexToRgbaConverter', () => {
        const component = window.document.createElement(componentTag) as HexToRgbaConverter;
        expect(component).toBeInstanceOf(HexToRgbaConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
