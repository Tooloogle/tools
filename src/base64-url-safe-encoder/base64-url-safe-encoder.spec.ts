import { LitElement } from 'lit';
import { Base64UrlSafeEncoder } from "./base64-url-safe-encoder.js";

describe('base64-url-safe-encoder web component test', () => {

    const componentTag = "base64-url-safe-encoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Base64UrlSafeEncoder', () => {
        const component = window.document.createElement(componentTag) as Base64UrlSafeEncoder;
        expect(component).toBeInstanceOf(Base64UrlSafeEncoder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
