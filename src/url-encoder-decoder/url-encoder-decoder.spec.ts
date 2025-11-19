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

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
