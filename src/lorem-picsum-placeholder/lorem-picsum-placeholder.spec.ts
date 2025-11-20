import { LitElement } from 'lit';
import { LoremPicsumPlaceholder } from "./lorem-picsum-placeholder.js";

describe('lorem-picsum-placeholder web component test', () => {

    const componentTag = "lorem-picsum-placeholder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of LoremPicsumPlaceholder', () => {
        const component = window.document.createElement(componentTag) as LoremPicsumPlaceholder;
        expect(component).toBeInstanceOf(LoremPicsumPlaceholder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
