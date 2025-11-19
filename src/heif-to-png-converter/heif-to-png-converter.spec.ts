import { LitElement } from 'lit';
import { HeifToPngConverter } from "./heif-to-png-converter.js";

describe('heif-to-png-converter web component test', () => {

    const componentTag = "heif-to-png-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HeifToPngConverter', () => {
        const component = window.document.createElement(componentTag) as HeifToPngConverter;
        expect(component).toBeInstanceOf(HeifToPngConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
