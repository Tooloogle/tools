import { LitElement } from 'lit';
import { ImageToIcoConverter } from './image-to-ico-converter.js';

describe('image-to-ico-converter web component test', () => {
    const componentTag = 'image-to-ico-converter';

    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ImageToIcoConverter', () => {
        const component = window.document.createElement(componentTag) as ImageToIcoConverter;
        expect(component).toBeInstanceOf(ImageToIcoConverter);
    });

    it('should have null file by default', () => {
        const component = window.document.createElement(componentTag) as ImageToIcoConverter;
        expect(component.file).toBeNull();
    });

    it('should have default selectedSizes', () => {
        const component = window.document.createElement(componentTag) as ImageToIcoConverter;
        expect(component.selectedSizes).toEqual([16, 32, 48]);
    });

    it('should have isConverting as false by default', () => {
        const component = window.document.createElement(componentTag) as ImageToIcoConverter;
        expect(component.isConverting).toBe(false);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
