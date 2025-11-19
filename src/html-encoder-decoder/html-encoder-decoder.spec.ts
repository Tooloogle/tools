import { LitElement } from 'lit';
import { HtmlEncoderDecoder } from "./html-encoder-decoder.js";

describe('html-encoder-decoder web component test', () => {

    const componentTag = "html-encoder-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlEncoderDecoder', () => {
        const component = window.document.createElement(componentTag) as HtmlEncoderDecoder;
        expect(component).toBeInstanceOf(HtmlEncoderDecoder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
