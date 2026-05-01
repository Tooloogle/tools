import { LitElement } from 'lit';
import { ImageCompressor } from './image-compressor.js';

describe('image-compressor web component test', () => {
    const componentTag = 'image-compressor';

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should render web component', async () => {
        const component = document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;
        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ImageCompressor', () => {
        const component = document.createElement(componentTag) as ImageCompressor;
        expect(component).toBeInstanceOf(ImageCompressor);
    });
});
