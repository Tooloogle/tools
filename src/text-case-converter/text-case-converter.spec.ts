import { LitElement } from 'lit';
import { TextCaseConverter } from "./text-case-converter.js";

describe('text-case-converter web component test', () => {

    const componentTag = "text-case-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextCaseConverter', () => {
        const component = window.document.createElement(componentTag) as TextCaseConverter;
        expect(component).toBeInstanceOf(TextCaseConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
