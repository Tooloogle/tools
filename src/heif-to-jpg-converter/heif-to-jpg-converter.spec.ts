import { LitElement } from 'lit';
import { HeifToJpgConverter } from "./heif-to-jpg-converter.js";

describe('heif-to-jpg-converter web component test', () => {

    const componentTag = "heif-to-jpg-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HeifToJpgConverter', () => {
        const component = window.document.createElement(componentTag) as HeifToJpgConverter;
        expect(component).toBeInstanceOf(HeifToJpgConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
