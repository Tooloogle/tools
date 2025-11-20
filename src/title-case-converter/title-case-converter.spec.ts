import { LitElement } from 'lit';
import { TitleCaseConverter } from "./title-case-converter.js";

describe('title-case-converter web component test', () => {

    const componentTag = "title-case-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TitleCaseConverter', () => {
        const component = window.document.createElement(componentTag) as TitleCaseConverter;
        expect(component).toBeInstanceOf(TitleCaseConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
