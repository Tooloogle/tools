import { LitElement } from 'lit';
import { TokenGenerator } from "./token-generator.js";

describe('token-generator web component test', () => {

    const componentTag = "token-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TokenGenerator', () => {
        const component = window.document.createElement(componentTag) as TokenGenerator;
        expect(component).toBeInstanceOf(TokenGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
