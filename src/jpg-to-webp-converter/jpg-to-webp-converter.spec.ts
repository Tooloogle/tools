import { LitElement } from 'lit';
import { JpgToWebpConverter } from "./jpg-to-webp-converter.js";

describe('jpg-to-webp-converter web component test', () => {

    const componentTag = "jpg-to-webp-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JpgToWebpConverter', () => {
        const component = window.document.createElement(componentTag) as JpgToWebpConverter;
        expect(component).toBeInstanceOf(JpgToWebpConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
