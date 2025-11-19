import { LitElement } from 'lit';
import { Base64ToImage } from "./base64-to-image.js";

describe('base64-to-image web component test', () => {

    const componentTag = "base64-to-image";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Base64ToImage', () => {
        const component = window.document.createElement(componentTag) as Base64ToImage;
        expect(component).toBeInstanceOf(Base64ToImage);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
