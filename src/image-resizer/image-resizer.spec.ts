import { LitElement } from 'lit';
import { ImageResizer } from './image-resizer.js';

describe('image-resizer web component test', () => {
    const componentTag = 'image-resizer';

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

    it('should be an instance of ImageResizer', () => {
        const component = document.createElement(componentTag) as ImageResizer;
        expect(component).toBeInstanceOf(ImageResizer);
    });
});
