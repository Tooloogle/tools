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

    it('should have default length of 10', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        expect(component.length).toBe(10);
    });

    it('should generate password with correct length', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        component.length = 15;
        component.generate();
        
        expect(component.password.length).toBe(15);
    });

    it('should generate password with alphanumeric characters only', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        component.generate();
        
        const alphanumericPattern = /^[0-9A-Za-z]+$/;
        expect(alphanumericPattern.test(component.password)).toBe(true);
    });

    it('should generate different passwords on each call', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        component.generate();
        const password1 = component.password;
        
        component.generate();
        const password2 = component.password;
        
        // With high probability, passwords should be different
        // (there's a tiny chance they could be the same, but it's negligible)
        expect(password1).not.toBe(password2);
    });

    it('should handle minimum length', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        component.length = 1;
        component.generate();
        
        expect(component.password.length).toBe(1);
    });

    it('should handle large length', () => {
        const component = window.document.createElement(componentTag) as PasswordGenerator;
        component.length = 50;
        component.generate();
        
        expect(component.password.length).toBe(50);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
