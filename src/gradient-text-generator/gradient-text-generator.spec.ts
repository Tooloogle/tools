import { LitElement } from 'lit';
import { GradientTextGenerator } from "./gradient-text-generator.js";

describe('gradient-text-generator web component test', () => {

    const componentTag = "gradient-text-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of GradientTextGenerator', () => {
        const component = window.document.createElement(componentTag) as GradientTextGenerator;
        expect(component).toBeInstanceOf(GradientTextGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
