import { LitElement } from 'lit';
import { StringHasher } from "./string-hasher.js";

describe('string-hasher web component test', () => {

    const componentTag = "string-hasher";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of StringHasher', () => {
        const component = window.document.createElement(componentTag) as StringHasher;
        expect(component).toBeInstanceOf(StringHasher);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
