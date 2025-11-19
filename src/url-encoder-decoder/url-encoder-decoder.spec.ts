import { LitElement } from 'lit';
import { UrlEncoderDecoder } from "./url-encoder-decoder.js";

describe('url-encoder-decoder web component test', () => {

    const componentTag = "url-encoder-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UrlEncoderDecoder', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        expect(component).toBeInstanceOf(UrlEncoderDecoder);
    });

    it('should have initial empty value', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        expect(component.value).toBe("");
    });

    it('should encode URL with special characters', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        component.value = "Hello World!";
        component.encode();
        
        // Note: encodeURIComponent doesn't encode ! by default
        expect(component.value).toBe("Hello%20World!");
    });

    it('should decode encoded URL', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        component.value = "Hello%20World!";
        component.decode();
        
        expect(component.value).toBe("Hello World!");
    });

    it('should encode URL with query parameters', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        component.value = "name=John Doe&email=john@example.com";
        component.encode();
        
        expect(component.value).toBe("name%3DJohn%20Doe%26email%3Djohn%40example.com");
    });

    it('should handle empty string encoding', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        component.value = "";
        component.encode();
        
        expect(component.value).toBe("");
    });

    it('should encode special characters correctly', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        component.value = "!@#$%^&*()";
        component.encode();
        
        expect(component.value).toBe("!%40%23%24%25%5E%26*()");
    });

    it('should encode and decode maintaining original value', () => {
        const component = window.document.createElement(componentTag) as UrlEncoderDecoder;
        const original = "Test String with Spaces & Special Characters!";
        
        component.value = original;
        component.encode();
        const encoded = component.value;
        expect(encoded).not.toBe(original);
        
        component.decode();
        expect(component.value).toBe(original);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
