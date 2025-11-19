import { LitElement } from 'lit';
import { ImageToBase64 } from "./image-to-base64.js";

describe('image-to-base64 web component test', () => {

    const componentTag = "image-to-base64";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ImageToBase64', () => {
        const component = window.document.createElement(componentTag) as ImageToBase64;
        expect(component).toBeInstanceOf(ImageToBase64);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
