import { LitElement } from 'lit';
import { CamelCaseConverter } from "./camel-case-converter.js";

describe('camel-case-converter web component test', () => {

    const componentTag = "camel-case-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CamelCaseConverter', () => {
        const component = window.document.createElement(componentTag) as CamelCaseConverter;
        expect(component).toBeInstanceOf(CamelCaseConverter);
    });

    describe('conversion edge cases', () => {
        const cases: [string, string][] = [
            ['HelloWorld', 'helloWorld'],
            ['helloWorld', 'helloWorld'],
            ['hello world', 'helloWorld'],
            ['hello_world', 'helloWorld'],
            ['hello-world', 'helloWorld'],
            ['HELLO WORLD', 'helloWorld'],
            ['  hello   world  ', 'helloWorld'],
            ['XMLHttpRequest', 'xmlHttpRequest'],
            ['foo123bar', 'foo123bar'],
            ['already', 'already'],
            ['', ''],
        ];

        it.each(cases)('converts "%s" to "%s"', (input, expected) => {
            const component = window.document.createElement(componentTag) as CamelCaseConverter;
            component.inputText = input;
            (component as unknown as { convert(): void })['convert']();
            expect(component.outputText).toBe(expected);
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
