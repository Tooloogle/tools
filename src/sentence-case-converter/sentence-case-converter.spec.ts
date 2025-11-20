import { LitElement } from 'lit';
import { SentenceCaseConverter } from "./sentence-case-converter.js";

describe('sentence-case-converter web component test', () => {

    const componentTag = "sentence-case-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SentenceCaseConverter', () => {
        const component = window.document.createElement(componentTag) as SentenceCaseConverter;
        expect(component).toBeInstanceOf(SentenceCaseConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
