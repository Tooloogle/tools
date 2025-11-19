import { LitElement } from 'lit';
import { EmailValidator } from "./email-validator.js";

describe('email-validator web component test', () => {

    const componentTag = "email-validator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of EmailValidator', () => {
        const component = window.document.createElement(componentTag) as EmailValidator;
        expect(component).toBeInstanceOf(EmailValidator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
