import { LitElement } from 'lit';
import { WebpToJpgConverter } from "./webp-to-jpg-converter.js";

describe('webp-to-jpg-converter web component test', () => {

    const componentTag = "webp-to-jpg-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WebpToJpgConverter', () => {
        const component = window.document.createElement(componentTag) as WebpToJpgConverter;
        expect(component).toBeInstanceOf(WebpToJpgConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
