import { LitElement } from 'lit';
import { TFileDropzone } from './t-file-dropzone.js';

describe('t-file-dropzone web component test', () => {
    const componentTag = 't-file-dropzone';

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

    it('should be an instance of TFileDropzone', () => {
        const component = document.createElement(componentTag) as TFileDropzone;
        expect(component).toBeInstanceOf(TFileDropzone);
    });
});
