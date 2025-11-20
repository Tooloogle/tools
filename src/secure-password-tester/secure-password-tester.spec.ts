import { LitElement } from 'lit';
import { SecurePasswordTester } from "./secure-password-tester.js";

describe('secure-password-tester web component test', () => {

    const componentTag = "secure-password-tester";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SecurePasswordTester', () => {
        const component = window.document.createElement(componentTag) as SecurePasswordTester;
        expect(component).toBeInstanceOf(SecurePasswordTester);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
