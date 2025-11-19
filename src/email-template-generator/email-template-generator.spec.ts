import { LitElement } from 'lit';
import { EmailTemplateGenerator } from "./email-template-generator.js";

describe('email-template-generator web component test', () => {

    const componentTag = "email-template-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of EmailTemplateGenerator', () => {
        const component = window.document.createElement(componentTag) as EmailTemplateGenerator;
        expect(component).toBeInstanceOf(EmailTemplateGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
