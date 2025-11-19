import { LitElement } from 'lit';
import { CaseConverterAdvanced } from "./case-converter-advanced.js";

describe('case-converter-advanced web component test', () => {

    const componentTag = "case-converter-advanced";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CaseConverterAdvanced', () => {
        const component = window.document.createElement(componentTag) as CaseConverterAdvanced;
        expect(component).toBeInstanceOf(CaseConverterAdvanced);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
