import { LitElement } from 'lit';
import { SlugGenerator } from "./slug-generator.js";

describe('slug-generator web component test', () => {

    const componentTag = "slug-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SlugGenerator', () => {
        const component = window.document.createElement(componentTag) as SlugGenerator;
        expect(component).toBeInstanceOf(SlugGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
