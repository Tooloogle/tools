import { LitElement } from 'lit';
import { AesDecryption } from "./aes-decryption.js";

describe('aes-decryption web component test', () => {

    const componentTag = "aes-decryption";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AesDecryption', () => {
        const component = window.document.createElement(componentTag) as AesDecryption;
        expect(component).toBeInstanceOf(AesDecryption);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
