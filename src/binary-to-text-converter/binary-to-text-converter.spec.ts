import { LitElement } from 'lit';
import { BinaryToTextConverter } from "./binary-to-text-converter.js";

describe('binary-to-text-converter web component test', () => {

    const componentTag = "binary-to-text-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BinaryToTextConverter', () => {
        const component = window.document.createElement(componentTag) as BinaryToTextConverter;
        expect(component).toBeInstanceOf(BinaryToTextConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
