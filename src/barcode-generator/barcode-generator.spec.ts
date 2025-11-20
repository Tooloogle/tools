import { LitElement } from 'lit';
import { BarcodeGenerator } from "./barcode-generator.js";

describe('barcode-generator web component test', () => {

    const componentTag = "barcode-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BarcodeGenerator', () => {
        const component = window.document.createElement(componentTag) as BarcodeGenerator;
        expect(component).toBeInstanceOf(BarcodeGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
