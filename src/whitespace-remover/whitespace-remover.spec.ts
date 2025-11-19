import { LitElement } from 'lit';
import { WhitespaceRemover } from "./whitespace-remover.js";

describe('whitespace-remover web component test', () => {

    const componentTag = "whitespace-remover";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WhitespaceRemover', () => {
        const component = window.document.createElement(componentTag) as WhitespaceRemover;
        expect(component).toBeInstanceOf(WhitespaceRemover);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
