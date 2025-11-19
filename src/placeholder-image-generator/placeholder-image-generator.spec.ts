import { LitElement } from 'lit';
import { PlaceholderImageGenerator } from "./placeholder-image-generator.js";

describe('placeholder-image-generator web component test', () => {

    const componentTag = "placeholder-image-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PlaceholderImageGenerator', () => {
        const component = window.document.createElement(componentTag) as PlaceholderImageGenerator;
        expect(component).toBeInstanceOf(PlaceholderImageGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
