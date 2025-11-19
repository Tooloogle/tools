import { LitElement } from 'lit';
import { QrCodeGenerator } from "./qr-code-generator.js";

describe('qr-code-generator web component test', () => {

    const componentTag = "qr-code-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of QrCodeGenerator', () => {
        const component = window.document.createElement(componentTag) as QrCodeGenerator;
        expect(component).toBeInstanceOf(QrCodeGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
