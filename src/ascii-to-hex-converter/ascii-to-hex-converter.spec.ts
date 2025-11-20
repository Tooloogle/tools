import { LitElement } from 'lit';
import { AsciiToHexConverter } from "./ascii-to-hex-converter.js";

describe('ascii-to-hex-converter web component test', () => {

    const componentTag = "ascii-to-hex-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AsciiToHexConverter', () => {
        const component = window.document.createElement(componentTag) as AsciiToHexConverter;
        expect(component).toBeInstanceOf(AsciiToHexConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
