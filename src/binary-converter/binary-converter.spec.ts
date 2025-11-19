import { LitElement } from 'lit';
import { BinaryConverter } from "./binary-converter.js";

describe('binary-converter web component test', () => {

    const componentTag = "binary-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BinaryConverter', () => {
        const component = window.document.createElement(componentTag) as BinaryConverter;
        expect(component).toBeInstanceOf(BinaryConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
