import { LitElement } from 'lit';
import { Rot13EncoderDecoder } from "./rot13-encoder-decoder.js";

describe('rot13-encoder-decoder web component test', () => {

    const componentTag = "rot13-encoder-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Rot13EncoderDecoder', () => {
        const component = window.document.createElement(componentTag) as Rot13EncoderDecoder;
        expect(component).toBeInstanceOf(Rot13EncoderDecoder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
