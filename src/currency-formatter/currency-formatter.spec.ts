import { LitElement } from 'lit';
import { CurrencyFormatter } from "./currency-formatter.js";

describe('currency-formatter web component test', () => {

    const componentTag = "currency-formatter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CurrencyFormatter', () => {
        const component = window.document.createElement(componentTag) as CurrencyFormatter;
        expect(component).toBeInstanceOf(CurrencyFormatter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
