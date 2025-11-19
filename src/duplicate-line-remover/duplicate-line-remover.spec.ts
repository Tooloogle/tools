import { LitElement } from 'lit';
import { DuplicateLineRemover } from "./duplicate-line-remover.js";

describe('duplicate-line-remover web component test', () => {

    const componentTag = "duplicate-line-remover";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DuplicateLineRemover', () => {
        const component = window.document.createElement(componentTag) as DuplicateLineRemover;
        expect(component).toBeInstanceOf(DuplicateLineRemover);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
