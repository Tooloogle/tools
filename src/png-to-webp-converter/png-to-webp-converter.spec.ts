import { LitElement } from 'lit';
import { PngToWebpConverter } from "./png-to-webp-converter.js";

describe('png-to-webp-converter web component test', () => {

    const componentTag = "png-to-webp-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PngToWebpConverter', () => {
        const component = window.document.createElement(componentTag) as PngToWebpConverter;
        expect(component).toBeInstanceOf(PngToWebpConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
