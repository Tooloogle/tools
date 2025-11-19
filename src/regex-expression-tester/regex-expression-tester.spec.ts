import { LitElement } from 'lit';
import { RegexExpressionTester } from "./regex-expression-tester.js";

describe('regex-expression-tester web component test', () => {

    const componentTag = "regex-expression-tester";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RegexExpressionTester', () => {
        const component = window.document.createElement(componentTag) as RegexExpressionTester;
        expect(component).toBeInstanceOf(RegexExpressionTester);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
