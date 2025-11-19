import { LitElement } from 'lit';
import { CreditCardValidator } from "./credit-card-validator.js";

describe('credit-card-validator web component test', () => {

    const componentTag = "credit-card-validator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CreditCardValidator', () => {
        const component = window.document.createElement(componentTag) as CreditCardValidator;
        expect(component).toBeInstanceOf(CreditCardValidator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
