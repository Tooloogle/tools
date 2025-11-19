import { LitElement } from 'lit';
import { PasswordGenerator } from "./password-generator.js";

describe('password-generator web component test', () => {

    const componentTag = "password-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PasswordGenerator', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        expect(component).toBeInstanceOf(PasswordGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
