import { LitElement } from 'lit';
import { Base64EncoderDecoder } from "./base64-encoder-decoder.js";

describe('base64-encoder-decoder web component test', () => {

    const componentTag = "base64-encoder-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Base64EncoderDecoder', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        expect(component).toBeInstanceOf(Base64EncoderDecoder);
    });

    it('should have initial empty values', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        expect(component.encoded).toBe("");
        expect(component.decoded).toBe("");
    });

    it('should encode plain text to base64', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: 'Hello World' } });
        component['onDecodedChange'](event);

        expect(component.decoded).toBe('Hello World');
        expect(component.encoded).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should decode base64 to plain text', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: 'SGVsbG8gV29ybGQ=' } });
        component['onEncodedChange'](event);

        expect(component.encoded).toBe('SGVsbG8gV29ybGQ=');
        expect(component.decoded).toBe('Hello World');
    });

    it('should handle empty string encoding', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '' } });
        component['onDecodedChange'](event);

        expect(component.decoded).toBe('');
        expect(component.encoded).toBe('');
    });

    it('should encode special characters correctly', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '!@#$%^&*()' } });
        component['onDecodedChange'](event);

        expect(component.decoded).toBe('!@#$%^&*()');
        expect(component.encoded).toBe('IUAjJCVeJiooKQ==');
    });

    it('should handle numbers encoding', () => {
        const component = window.document.createElement(componentTag) as Base64EncoderDecoder;
        
        const event = new Event('keyup');
        Object.defineProperty(event, 'target', { value: { value: '1234567890' } });
        component['onDecodedChange'](event);

        expect(component.decoded).toBe('1234567890');
        expect(component.encoded).toBe('MTIzNDU2Nzg5MA==');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
