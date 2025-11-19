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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
