import { LitElement } from 'lit';
import { WebpToPngConverter } from "./webp-to-png-converter.js";

describe('webp-to-png-converter web component test', () => {

    const componentTag = "webp-to-png-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WebpToPngConverter', () => {
        const component = window.document.createElement(componentTag) as WebpToPngConverter;
        expect(component).toBeInstanceOf(WebpToPngConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
