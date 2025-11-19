import { LitElement } from 'lit';
import { JwtDecoder } from "./jwt-decoder.js";

describe('jwt-decoder web component test', () => {

    const componentTag = "jwt-decoder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JwtDecoder', () => {
        const component = window.document.createElement(componentTag) as JwtDecoder;
        expect(component).toBeInstanceOf(JwtDecoder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
