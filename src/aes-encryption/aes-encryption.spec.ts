import { LitElement } from 'lit';
import { AesEncryption } from "./aes-encryption.js";

describe('aes-encryption web component test', () => {

    const componentTag = "aes-encryption";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of AesEncryption', () => {
        const component = window.document.createElement(componentTag) as AesEncryption;
        expect(component).toBeInstanceOf(AesEncryption);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
