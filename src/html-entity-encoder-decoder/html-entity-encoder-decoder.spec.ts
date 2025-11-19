import { LitElement } from 'lit';
import { HtmlEntityEncoderDecoder } from "./html-entity-encoder-decoder.js";

describe('html-entity-encoder-decoder web component test', () => {

    const componentTag = "html-entity-encoder-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlEntityEncoderDecoder', () => {
        const component = window.document.createElement(componentTag) as HtmlEntityEncoderDecoder;
        expect(component).toBeInstanceOf(HtmlEntityEncoderDecoder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
