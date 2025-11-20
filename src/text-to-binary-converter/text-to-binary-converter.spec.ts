import { LitElement } from 'lit';
import { TextToBinaryConverter } from "./text-to-binary-converter.js";

describe('text-to-binary-converter web component test', () => {

    const componentTag = "text-to-binary-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextToBinaryConverter', () => {
        const component = window.document.createElement(componentTag) as TextToBinaryConverter;
        expect(component).toBeInstanceOf(TextToBinaryConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
