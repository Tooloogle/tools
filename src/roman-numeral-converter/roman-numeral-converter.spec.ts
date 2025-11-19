import { LitElement } from 'lit';
import { RomanNumeralConverter } from "./roman-numeral-converter.js";

describe('roman-numeral-converter web component test', () => {

    const componentTag = "roman-numeral-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RomanNumeralConverter', () => {
        const component = window.document.createElement(componentTag) as RomanNumeralConverter;
        expect(component).toBeInstanceOf(RomanNumeralConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
