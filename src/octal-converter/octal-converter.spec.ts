import { LitElement } from 'lit';
import { OctalConverter } from "./octal-converter.js";

describe('octal-converter web component test', () => {

    const componentTag = "octal-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of OctalConverter', () => {
        const component = window.document.createElement(componentTag) as OctalConverter;
        expect(component).toBeInstanceOf(OctalConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
